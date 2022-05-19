# ndse-homework

## DTOs

### BookDTO
```
{
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: boolean,
  fileCover: "string",
  fileName: "string",
  fileBook: "string"
}
```

## методы
| метод | url | действие | комментарий |
| --- | --- | --- | --- |
| POST| /api/user/login | авторизация пользователя | метод всегда возвращает Code: 201 и статичный объект: { id: 1, mail: "test@mail.ru" } |
| GET | /api/books | получить все книги | получаем массив всех книг |
| GET | /api/books/:id | получить книгу по id | получаем объект книги, если запись не найдено вернем Code: 404 |
| GET | /api/books/:id/download | загрузить книгу по id | получаем на скачивание книгу, если запись не найдено вернем Code: 404 |
| POST | /api/books | создать книгу | создаем книги и возврашаем ее же вместе с присвоенным id |
| PUT | /api/books/:id | редактировать книгу по id | редактируем объект книги, если запись не найдено вернем Code: 404 |
| DELETE | /api/books/:id | удалить книгу по id | удаляем книгу и возвращаем ответ: 'ok'|

## MongoDB
```js
db.books.insertMany([
  { title: "Book title 1", description: "Book description 1", authors: "Authors 1..." },
  { title: "Book title 2", description: "Book description 2", authors: "Authors 2..." },
])
```
```js
db.books.find({
  { title: 'title? типа задача найти конкретную книгу по title?'},
  { title: 1, description: 1, authors: 1 }
})
```
```js
db.books.updateOne(
  { _id: 'id'},
  { authors: 'new authors', description: 'new desc' }
)
```
