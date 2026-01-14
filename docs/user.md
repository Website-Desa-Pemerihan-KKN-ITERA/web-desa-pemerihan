# User API

## POST - Register 

Endpoint: `http://localhost:3000/api/auth/register`
Method: `POST`

Request Body :

```json
{
	"username": "admin",
	"password": "admin123"
}
```

Response Body - Success :

```json
{
	"message": "User Berhasil Dibuat"
}
```

Response Body - Error : 

```json
{
	"error": {
		"message": "Validasi gagal",
		"code": "VALIDATION_ERROR",
		"status": 422,
		"details": {
			"errors": [],
			"properties": {
				"username": {
					"errors": [
						"Too small: expected string to have >=5 characters"
					]
				}
			}
		}
	}
}
```

## POST - Login

Endpoint: `http://localhost:3000/api/auth/login`
Method: `POST`

Request Body :

```json
{
	"username": "admin",
	"password": "admin123"
}
```

Response Body - Success :

```json
{
	"message": "Login berhasil",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJle...."
}
```

Response Body - Error : 

```json
{
	"error": {
		"message": "Validasi gagal",
		"code": "VALIDATION_ERROR",
		"status": 422,
		"details": {
			"errors": [],
			"properties": {
				"username": {
					"errors": [
						"Too small: expected string to have >=5 characters"
					]
				}
			}
		}
	}
}
```


## PUT - Change Password

Endpoint: `http://localhost:3000/api/auth/login`
Method: `PUT`
Headers: `Authorization: Bearer {token}`

Request Body :

```json
{
	"username": "oda123",
	"password": "oda123",
	"newPassword": "oda111"
}
```

Response Body - Success :

```json
{
	"message": "Password berhasil diubah."
}
```

Response Body - Error : 

```json
{
	"error": "Password salah"
}
```

