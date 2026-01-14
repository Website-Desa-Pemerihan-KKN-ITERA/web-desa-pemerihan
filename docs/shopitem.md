# Shopitem API

## POST - Membuat Item Shop Baru

Endpoint: `http://localhost:3000/api/shopitem`
Method: `POST`
Headers: `Authorization <Bearer Token>`

Request Body :

```json
{
  "name": "string",
  "price": "integer",
  "contact": "string",
  "description": "string",
  "featuredImageUrl": "string (minimal 5 karakter)"
}
```

Response Body Success :

```json
{
  "message": "Item berhasil diupload"
}
```

Response Body Error : 

```json
{
  "error": "string (deskripsi error)"
}
```

---

## GET - Mendapatkan Daftar Item Shop

Endpoint: `http://localhost:3000/api/shopitem`
Method: `GET`
Headers: `Authorization <Bearer Token>`

Query Parameters:
- `page` (optional, default: 1) - Nomor halaman
- `limit` (optional, default: 10, max: 100) - Jumlah item per halaman

Request Body : (tidak ada)

Response Body Success :

```json
{
  "success": true,
  "data": [
    {
      "id": "integer",
      "name": "string",
      "slug": "string",
      "price": "integer",
      "contact": "string",
      "description": "string",
      "featuredImageUrl": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "meta": {
    "page": "integer",
    "limit": "integer",
    "totalItems": "integer",
    "totalPages": "integer",
    "hasNextPage": "boolean",
    "hasPrevPage": "boolean"
  }
}
```

Response Body Error : 

```json
{
  "error": "string",
  "success": false
}
```

---

## PUT - Mengubah Item Shop

Endpoint: `http://localhost:3000/api/shopitem/id/{id}`
Method: `PUT`
Headers: `Authorization <Bearer Token>`

Request Body :

```json
{
  "name": "string",
  "price": "number",
  "contact": "string",
  "description": "string",
  "featuredImageUrl": "string (optional, minimal 5 karakter)"
}
```

Response Body Success :

```json
{
  "message": "Update berhasil",
  "data": {
    "id": "integer",
    "name": "string",
    "slug": "string",
    "price": "integer",
    "contact": "string",
    "description": "string",
    "featuredImageUrl": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Response Body Error : 

```json
{
  "error": "string"
}
```

---

## DELETE - Menghapus Item Shop

Endpoint: `http://localhost:3000/api/shopitem/id/{id}`
Method: `DELETE`
Headers: `Authorization <Bearer Token>`

Request Body : (tidak ada)

Response Body Success :

```json
{
  "message": "Item berhasil dihapus",
  "data": {
    "id": "integer",
    "name": "string",
    "slug": "string",
    "price": "integer",
    "contact": "string",
    "description": "string",
    "featuredImageUrl": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Response Body Error : 

```json
{
  "error": "string"
}
```



