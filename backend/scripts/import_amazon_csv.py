import csv
import json
import os
import sys
from datetime import datetime
from pathlib import Path

from supabase import create_client

csv.field_size_limit(50 * 1024 * 1024)


def load_env_file():
    env_candidates = [
        Path(__file__).resolve().parents[1] / '.env',
        Path(__file__).resolve().parents[2] / '.env',
        Path.home() / '.env',
    ]

    for env_path in env_candidates:
        if not env_path.exists():
            continue
        with env_path.open('r', encoding='utf-8') as handle:
            for line in handle:
                raw = line.strip()
                if not raw or raw.startswith('#') or '=' not in raw:
                    continue
                key, value = raw.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


CSV_CANDIDATES = [
    Path(__file__).resolve().parents[2] / 'amazon-products.csv',
    Path(__file__).resolve().parents[1] / 'amazon-products.csv',
    Path('c:/Users/tharu/Downloads/amazon-products.csv'),
    Path('C:/Users/tharu/Downloads/amazon-products.csv'),
]

CSV_PATH = next((path for path in CSV_CANDIDATES if path.exists()), CSV_CANDIDATES[0])


def to_float(value):
    if value is None:
        return 0.0
    text = str(value).strip().replace('"', '').replace(',', '')
    if text.lower() in ('', 'null', 'none', 'nan'):
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def parse_first_category(value):
    if value is None or str(value).strip() in ('', 'null', 'None'):
        return 'General'

    text = str(value).strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list) and parsed:
            return str(parsed[0]).strip()
        if isinstance(parsed, str) and parsed:
            return parsed.strip()
    except Exception:
        pass

    if text.startswith('[') and text.endswith(']'):
        text = text[1:-1].strip()
        if text:
            return text.strip('"').split(',')[0].strip()

    return text.replace('"', '').split(',')[0].strip()


def normalize_images(value):
    if value is None:
        return []

    if isinstance(value, list):
        items = []
        for item in value:
            items.extend(normalize_images(item))
        return items

    if isinstance(value, tuple):
        return normalize_images(list(value))

    text = str(value).strip()
    if text in ('', 'null', 'None', '[]'):
        return []

    if text.startswith('['):
        try:
            parsed = json.loads(text)
            return normalize_images(parsed)
        except Exception:
            pass

    if text.startswith('"') and text.endswith('"'):
        try:
            return normalize_images(json.loads(text))
        except Exception:
            pass

    if 'http' in text:
        return [text]

    return [text]


def parse_specs(row):
    specs = {}
    for key in ['product_dimensions', 'item_weight', 'model_number', 'manufacturer', 'department', 'brand', 'currency', 'origin_url']:
        value = row.get(key)
        if value not in (None, '', 'null', 'None'):
            specs[key] = str(value)
    if row.get('rating') not in (None, '', 'null', 'None'):
        specs['rating'] = str(row.get('rating'))
    if row.get('root_bs_rank') not in (None, '', 'null', 'None'):
        specs['root_bs_rank'] = str(row.get('root_bs_rank'))
    if row.get('asin'):
        specs['asin'] = str(row.get('asin'))
    return specs


def build_product(row, index):
    asin = (row.get('asin') or row.get('input_asin') or f'AMAZON-{index + 1}').strip()
    title = (row.get('title') or f'Product {index + 1}').strip()
    initial_price = to_float(row.get('initial_price'))
    final_price = to_float(row.get('final_price'))
    price = final_price if final_price > 0 else initial_price
    discount_price = initial_price if initial_price > 0 else price
    category = parse_first_category(row.get('categories')) or parse_first_category(row.get('root_bs_category')) or 'General'
    stock_value = str(row.get('is_available') or '').strip().lower()
    stock = 1 if stock_value in ('true', 'in stock', 'yes', 'available', 'in stock - order soon') else 0
    rating = to_float(row.get('rating'))
    reviews = int(to_float(row.get('reviews_count')))

    return {
        'product_id': asin,
        'name': title,
        'brand': (row.get('brand') or 'BUYVERSE').strip() or 'BUYVERSE',
        'category': category,
        'description': (row.get('description') or '').strip(),
        'price': round(price, 2),
        'discount_price': round(discount_price, 2),
        'images': json.dumps(normalize_images(row.get('image_url'))),
        'specifications': json.dumps(parse_specs(row)),
        'stock': stock,
        'delivery_days': 3,
        'rating': round(rating, 2) if rating else 0,
        'reviews': reviews,
        'featured': str(row.get('amazon_choice') or '').strip().lower() in ('true', 'yes', '1'),
        'best_seller': bool(row.get('root_bs_rank')) and int(to_float(row.get('root_bs_rank'))) > 0 and int(to_float(row.get('root_bs_rank'))) <= 20,
        'created_at': (row.get('timestamp') or datetime.utcnow().isoformat()).strip(),
        'updated_at': datetime.utcnow().isoformat(),
    }


def load_rows(csv_path):
    with open(csv_path, 'r', encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle)
        rows = []
        for index, row in enumerate(reader):
            try:
                rows.append(build_product(row, index))
            except Exception as exc:
                print(f'Skipping row {index}: {exc}', file=sys.stderr)
        return rows


def main():
    load_env_file()
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not url or not key:
        raise SystemExit('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.')

    if not os.path.exists(CSV_PATH):
        raise SystemExit(f'CSV file not found: {CSV_PATH}')

    rows = load_rows(CSV_PATH)
    if not rows:
        raise SystemExit('No rows were loaded from the CSV file.')

    client = create_client(url, key)

    try:
        client.table('products').delete().neq('product_id', '').execute()
        print('Cleared existing product rows before import.')
    except Exception as exc:
        print(f'Warning: unable to clear existing products before import: {exc}', file=sys.stderr)

    response = client.table('products').upsert(rows, on_conflict='product_id').execute()

    print(f'Inserted/updated {len(rows)} real CSV products into Supabase.')
    print(f'Inserted IDs sample: {[row["product_id"] for row in rows[:5]]}')
    print(response)


if __name__ == '__main__':
    main()
