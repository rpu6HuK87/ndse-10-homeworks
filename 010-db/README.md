# Домашнее задание к занятию «2.6 База данных и хранение данных»

### Задание 1
С документацией ознакомлен

### Задание 2
Добавляем книги:  
```
try {
  db.books.insertMany([
    {
      title: "Книга 1",
      description: "О том, о сем",
      authors: "Конфуций"
    },
    {
      title: "Книга 2",
      description: "Програмирование на NodeJS",
      authors: "Сократ"
    }
  ])
} catch (e) {
   print (e)
}
```
Поиск книги по title:  
```
const book = db.books.find({ title: "Книга 2" })

```
Редактирование полей description и authors книги по _id:  
```
const book = db.books.find({ title: "Книга 2" })
if(book) {
  try {
    db.books.updateOne(
       { _id: book._id },
       { 
          $set: { description: 'NodeJS: Cookbook', authors: 'Нетология' }
       }
    )
  } catch (e) {
    print (e)
  }
}

```