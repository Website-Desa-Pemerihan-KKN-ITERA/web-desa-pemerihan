# Artikel API

## POST - Posting Article 

Endpoint: `http://localhost:3000/api/article`
Method: `POST`
Headers: `Authorization: Bearer {token}`

Request Body :

```json
{
	"title": "Judul Artikel",
	"content": "Isi konten artikel ......",
	"featuredImageUrl": "https://urlimage.com/image.jpg"
}
```

Response Body - Success :

```json
{
	"message": "Article berhasil diupload"
}
```

Response Body - Error : 

```json
// Error jika judul artikel sudah ada
{
	"error": "Slug sudah ada"
}
```

## GET - Get All Article 

Endpoint: `http://localhost:3000/api/article?page=1&limit=10`
Method: `GET`
Headers: `Authorization: Bearer {token}`

Request Body : `None`

Response Body - Success :

```json
{
	"success": true,
	"data": [
		{
			"id": 2,
			"createdAt": "2026-01-11T08:14:08.830Z",
			"title": "Artikel Pertama",
			"slug": "artikel-pertama",
			"content": "Ini isi kontennya adalah kedua......",
			"featuredImageUrl": "https://firebasestorage.googleapis.com/v0/b/belajar-crud-sr.appspot.com/o/umkm_products%2Fp4%2Fkopi.jpeg?alt=media&token=cab08da2-aaea-4109-9979-3c806fb41aaa",
			"additionalImages": []
		},
		{
			"id": 1,
			"createdAt": "2026-01-11T02:37:15.608Z",
			"title": "Nama artikel",
			"slug": "nama-artikel",
			"content": "Bismillahirrahmanirrahim ......",
			"featuredImageUrl": "https://firebasestorage.googleapis.com/v0/b/belajar-crud-sr.appspot.com/o/umkm_products%2Fp4%2Fkopi.jpeg?alt=media&token=cab08da2-aaea-4109-9979-3c806fb41aaa",
			"additionalImages": []
		}
	],
	"meta": {
		"page": 1,
		"limit": 10,
		"totalItems": 2,
		"totalPages": 1,
		"hasNextPage": false,
		"hasPrevPage": false
	}
}
```

Response Body - Error : 

```json
{
	"error": {
		"errors": [],
		"properties": {
			"limit": {
				"errors": [
					"Too small: expected number to be >=1"
				]
			}
		}
	}
}
```

## GET - Get Article by Slug

Endpoint: `http://localhost:3000/api/article/slug/{slug}`
Method: `GET`
Headers: `Authorization: Bearer {token}`

Request Body : `None`

Response Body - Success:

```json
{
  "id": 1,
  "title": "Cara Belajar Next.js",
  "slug": "cara-belajar-nextjs",
  "content": "Ini adalah isi artikel...",
  "featuredImageUrl": "https://example.com/image.jpg",
  "createdAt": "2026-01-10T12:30:45.000Z",
  "updatedAt": "2026-01-10T12:30:45.000Z"
}
```

Response Body - Error:
```json
{
  "error": "Slug tidak valid"
}
```



