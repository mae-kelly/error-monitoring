module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
}
```

<document_path>.env.example</document_path>
```
DATABASE_URL="postgresql://user:password@localhost:5432/clx_errors"
AZURE_CLIENT_ID="your-client-id"
AZURE_CLIENT_SECRET="your-client-secret"
AZURE_TENANT_ID="your-tenant-id"
OUTLOOK_REFRESH_TOKEN=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000"