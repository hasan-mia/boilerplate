import { Document, Query } from 'mongoose'

interface QueryParams {
	keyword?: string
	price?: {
		gte?: number
		lte?: number
	}
	categoryInfo?: {
		categoryID?: string
		category?: string
	}
	page?: number
	limit?: number
}

class ApiFeatures<T extends Document> {
	query: Query<T[], T>

	constructor(
		query: Query<T[], T>,
		private queryStr: QueryParams,
	) {
		this.query = query
	}

	search() {
		const keyword = this.queryStr.keyword
			? {
					name: {
						$regex: this.queryStr.keyword,
						$options: 'i',
					},
				}
			: {}

		this.query = this.query.find({ ...keyword })
		return this
	}

	filter() {
		const queryCopy: QueryParams = { ...this.queryStr }
		const removeFields = ['keyword', 'page', 'limit']
		removeFields.forEach((key) => delete queryCopy[key])

		let priceQuery: { price?: { gte?: number; lte?: number } } = {}

		if (queryCopy.price && (queryCopy.price.gte || queryCopy.price.lte)) {
			const { price } = queryCopy
			priceQuery = {
				price: {},
			}
			if (price.gte) {
				priceQuery.price!.gte = price.gte
			}
			if (price.lte) {
				priceQuery.price!.lte = price.lte
			}
			delete queryCopy.price
		}

		if (queryCopy.categoryInfo) {
			const categoryQuery: QueryParams['categoryInfo'] = {}

			if (queryCopy.categoryInfo.categoryID) {
				categoryQuery['categoryInfo.categoryID'] =
					queryCopy.categoryInfo.categoryID
			}

			if (queryCopy.categoryInfo.category) {
				categoryQuery['categoryInfo.category'] = queryCopy.categoryInfo.category
			}

			delete queryCopy.categoryInfo

			this.query = this.query.find({ ...queryCopy, ...categoryQuery })
		} else {
			this.query = this.query.find(queryCopy)
		}

		return this
	}

	pagination(resultPerPage: number) {
		const currentPage = this.queryStr.page ? Number(this.queryStr.page) : 1
		const skip = resultPerPage * (currentPage - 1)

		this.query = this.query.limit(resultPerPage).skip(skip)
		return this
	}
}

export default ApiFeatures
