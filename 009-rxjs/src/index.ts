import { Observable  } from 'rxjs';
const axios = require('axios');

const stream$ = new Observable(observer => {
	axios.get('https://api.github.com/search/repositories?q=ndtnf').then(res => {
		observer.next(res.data)
	})
	.catch((error) => {
			observer.error(error);
	} )
})

const stream2$ = new Observable(observer => {
	axios.get('https://gitlab.com/api/v4/projects?search=nestjs').then(res => {
		observer.next(res.data)
	})
	.catch((error) => {
			observer.error(error);
	} )
})

stream$.subscribe({
	next: (data: []) => {
		console.log('Данные с github, репозитории "ndtnf"')
		data['items'].map(item => console.log(item.owner.login))
	},
	complete: () => console.log('Complete!'),
	error: (error) => console.log('Error!', error)
})

stream2$.subscribe({
	next: (data: []) => {
		console.log('Данные с gitlab, проекты "nestjs"')
		data.map(item => console.log(item['namespace']['name']))
	},
	complete: () => console.log('Complete!'),
	error: (error) => console.log('Error!', error)
})
