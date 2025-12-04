#!/usr/bin/env python3
"""
Generate GeoJSON FeatureCollection with country boundaries from ISO 3166-1 alpha-3 codes.
Uses the Natural Earth data via geopandas/requests to fetch country geometries.
"""

import json
import sys
from urllib.request import urlopen

# ISO 3166-1 alpha-3 country codes
COUNTRY_CODES = [
    'ABW', 'AFG', 'AGO', 'AIA', 'ALB', 'AND', 'ARE', 'ARG', 'ARM', 'ASM',
    'ATG', 'AUS', 'AUT', 'AZE', 'BDI', 'BEL', 'BEN', 'BFA', 'BGD', 'BGR',
    'BHR', 'BHS', 'BIH', 'BLM', 'BLR', 'BLZ', 'BMU', 'BOL', 'BRA', 'BRB',
    'BRN', 'BTN', 'BWA', 'CAF', 'CAN', 'CHE', 'CHL', 'CHN', 'CIV', 'CMR',
    'COD', 'COG', 'COK', 'COL', 'COM', 'CPV', 'CRI', 'CUB', 'CUW', 'CYM',
    'CYP', 'CZE', 'DEU', 'DJI', 'DMA', 'DNK', 'DOM', 'DZA', 'ECU', 'EGY',
    'ERI', 'ESH', 'ESP', 'EST', 'ETH', 'FIN', 'FJI', 'FLK', 'FRA', 'FRO',
    'FSM', 'GAB', 'GBR', 'GEO', 'GGY', 'GHA', 'GIB', 'GIN', 'GLP', 'GMB',
    'GNB', 'GNQ', 'GRC', 'GRD', 'GRL', 'GTM', 'GUF', 'GUM', 'GUY', 'HKG',
    'HND', 'HRV', 'HTI', 'HUN', 'IDN', 'IMN', 'IND', 'IRL', 'IRN', 'IRQ',
    'ISL', 'ISR', 'ITA', 'JAM', 'JEY', 'JOR', 'JPN', 'KAZ', 'KEN', 'KGZ',
    'KHM', 'KIR', 'KNA', 'KOR', 'KWT', 'LAO', 'LBN', 'LBR', 'LBY', 'LCA',
    'LIE', 'LKA', 'LSO', 'LTU', 'LUX', 'LVA', 'MAC', 'MAF', 'MAR', 'MCO',
    'MDA', 'MDG', 'MDV', 'MEX', 'MHL', 'MKD', 'MLI', 'MLT', 'MMR', 'MNE',
    'MNG', 'MNP', 'MOZ', 'MRT', 'MSR', 'MTQ', 'MUS', 'MWI', 'MYS', 'MYT',
    'NAM', 'NCL', 'NER', 'NGA', 'NIC', 'NIU', 'NLD', 'NOR', 'NPL', 'NRU',
    'NZL', 'OMN', 'PAK', 'PAN', 'PER', 'PHL', 'PLW', 'PNG', 'POL', 'PRI',
    'PRK', 'PRT', 'PRY', 'PSE', 'PYF', 'QAT', 'REU', 'ROU', 'RUS', 'RWA',
    'SAU', 'SDN', 'SEN', 'SGP', 'SLB', 'SLE', 'SLV', 'SMR', 'SOM', 'SPM',
    'SRB', 'SSD', 'STP', 'SUR', 'SVK', 'SVN', 'SWE', 'SWZ', 'SXM', 'SYC',
    'SYR', 'TCA', 'TCD', 'TGO', 'THA', 'TJK', 'TKL', 'TKM', 'TLS', 'TON',
    'TTO', 'TUN', 'TUR', 'TUV', 'TWN', 'TZA', 'UGA', 'UKR', 'URY', 'USA',
    'UZB', 'VAT', 'VCT', 'VEN', 'VGB', 'VIR', 'VNM', 'VUT', 'WLF', 'WSM',
    'YEM', 'ZAF', 'ZMB', 'ZWE'
]

def fetch_world_geojson():
    """Fetch world countries GeoJSON from Natural Earth via CDN."""
    url = "https://naciscdn.org/naturalearth/110m/cultural/ne_110m_admin_0_countries.geojson"
    
    try:
        with urlopen(url, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching data: {e}", file=sys.stderr)
        return None

def generate_feature_collection():
    """Generate GeoJSON FeatureCollection with specified country codes."""
    # Fetch world GeoJSON
    world_data = fetch_world_geojson()
    
    if not world_data:
        print("Failed to fetch world data", file=sys.stderr)
        sys.exit(1)
    
    # Create mapping of ISO A3 codes to features
    country_map = {}
    for feature in world_data.get('features', []):
        iso_a3 = feature.get('properties', {}).get('ISO_A3')
        if iso_a3:
            country_map[iso_a3] = feature
    
    # Build feature collection for requested countries
    features = []
    for code in COUNTRY_CODES:
        if code in country_map:
            feature = country_map[code]
            # Create new feature with only iso_a3 property
            new_feature = {
                "type": "Feature",
                "properties": {
                    "iso_a3": code
                },
                "geometry": feature.get('geometry', {})
            }
            features.append(new_feature)
    
    # Create FeatureCollection
    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return feature_collection

if __name__ == "__main__":
    geojson = generate_feature_collection()
    print(json.dumps(geojson, indent=2))
