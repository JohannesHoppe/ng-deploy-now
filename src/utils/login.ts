import fetch from 'node-fetch'
import { hostname } from 'os'
import emailPrompt from 'email-prompt'
import ms from 'ms'
import { sleep } from './output'
import { stringify } from 'querystring'
import { SchematicsException } from '@angular-devkit/schematics'
import chalk from 'chalk'

const API_ENDPOINT = 'https://api.zeit.co'

export async function login() {
	let email
	try {
		email = await emailPrompt({ start: 'Enter your email: ' })
	} catch (e) {
		if (e.message === 'User abort') {
			throw new SchematicsException('User aborted email prompt!')
		}
	}

	let securityCode
	let vertificationToken

	try {
		const data = await registration(email)
		securityCode = data.securityCode
		vertificationToken = data.token
	} catch (e) {
		throw new SchematicsException(
			`There was error with token request: ${e.message}`,
		)
	}
	// Empty line
	console.log()

	console.log(
		`We sent an email to ${chalk.bold(
			email,
		)}.\nPlease follow the steps provided, inside it and make sure the security code matches ${chalk.bold(
			securityCode,
		)}.`,
	)

	let token = null

	while (!token) {
		try {
			await sleep(ms('1s'))
			token = await vertify(email, vertificationToken)
		} catch (e) {
			console.log(e)
		}
	}

	return { token }
}

const registration = async (email: string) => {
	const hyphens = new RegExp('-', 'g')
	const host = hostname()
		.replace(hyphens, ' ')
		.replace('.local', '')
	const tokenName = `Now ng-deploy on ${host}`

	const response = await fetch(`${API_ENDPOINT}/now/registration`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			tokenName,
		}),
	})

	const body = await response.json()

	if (!response.ok) {
		const { error = {} } = body
		if (error.code === 'invalid_email') {
			throw new SchematicsException(
				`Provided email: "${email}" is invalid`,
			)
		}

		throw new SchematicsException(`Unexpected error: ${error.message}`)
	}

	return body
}

const vertify = async (email: string, vertificationToken: string) => {
	const query = {
		email,
		token: vertificationToken,
	}

	const response = await fetch(
		`${API_ENDPOINT}/now/registration/verify?${stringify(query)}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)

	const body = await response.json()

	return body.token
}
