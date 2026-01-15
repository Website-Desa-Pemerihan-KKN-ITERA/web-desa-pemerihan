# Shopitem API

## POST - Membuat Item Shop Baru

Endpoint: `http://localhost:3000/api/shopitem`
Method: `POST`
Headers: `Authorization <Bearer Token>`

Request Body :

```json
{
  "name": "Madu",
  "price": 10000,
  "contact": "081319306262",
  "description": "Madu dari lebah apikalis",
  "imagesUrl": ["madu.jpg"]
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

Endpoint: `http://localhost:3000/api/shopitem?page=10&limit=10`
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
      "id": 7,
      "createdAt": "2026-01-14T07:27:49.729Z",
      "name": "",
      "price": 10000,
      "slug": "",
      "contact": "081319306262",
      "description": "Madu apikalis aja",
      "imagesUrl": ["madu.jpg"]
    },
    {
      "id": 6,
      "createdAt": "2026-01-14T07:27:35.642Z",
      "name": "Madu2",
      "price": 10000,
      "slug": "madu2",
      "contact": "081319306262",
      "description": "",
      "imagesUrl": ["madu.jpg"]
    },
    {
      "id": 1,
      "createdAt": "2026-01-14T07:24:35.980Z",
      "name": "Madu",
      "price": 10000,
      "slug": "madu",
      "contact": "081319306262",
      "description": "Madu dari lebah apikalis",
      "imagesUrl": ["madu.jpg"]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 3,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
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
  "name": "Madu",
  "price": 10000,
  "contact": "081319306262",
  "description": "Madu aja sih",
  "imagesUrl": ["madu.jpg"]
}
```

Response Body Success :

```json
{
  "message": "Update berhasil",
  "data": {
    "id": 10,
    "createdAt": "2026-01-14T08:33:23.027Z",
    "name": "Madu",
    "price": 10000,
    "slug": "madu",
    "contact": "081319306262",
    "description": "Madu aja sih",
    "imagesUrl": ["4fa3dae2-29ad-4efd-b559-531c01a89236.jpg"]
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
    "id": 9,
    "createdAt": "2026-01-14T08:31:37.072Z",
    "name": "Madu Apikalis",
    "price": 10000,
    "slug": "madu-apikalis",
    "contact": "081319306262",
    "description": "Madu apikalis aja",
    "imagesUrl": ["madu.jpg"]
  }
}
```

Response Body Error :

```json
{
  "error": "Item tidak ditemukan"
}
```
