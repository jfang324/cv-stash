export class NotFoundError extends Error {
	status: number

	constructor(message: string) {
		super(message)

		this.name = 'NotFoundError'
		this.status = 404
	}
}

export class UnauthorizedError extends Error {
	status: number

	constructor(message: string) {
		super(message)

		this.name = 'UnauthorizedError'
		this.status = 401
	}
}

export class BadRequestError extends Error {
	status: number

	constructor(message: string, status?: number) {
		super(message)

		this.name = 'BadRequestError'
		this.status = status || 400
	}
}
