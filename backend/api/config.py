import os
import json

def handler(request):
    """
    API endpoint to serve Supabase configuration
    This keeps your keys secure on the server side
    """
    
    # Get environment variables from Vercel
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_anon_key = os.environ.get('SUPABASE_ANON_KEY')
    
    # Return configuration as JSON
    config = {
        'SUPABASE_URL': supabase_url,
        'SUPABASE_ANON_KEY': supabase_anon_key
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(config)
    }
