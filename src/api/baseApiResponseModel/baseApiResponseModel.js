export class BaseApiResponseModel {
  constructor(data, pageable, error) {
    this.data = data || []
    this.pageable = pageable || new Pageable()
    this.error = error || null
  }
}

export class Pageable {
  constructor(pageNumber = 0, pageSize = 10, totalPages = 0, totalElements = 0) {
    this.pageNumber = pageNumber
    this.pageSize = pageSize
    this.totalPages = totalPages
    this.totalElements = totalElements
  }
}

export class Error {
  constructor(message = '', error = '') {
    this.message = message
    this.error = error
  }
}