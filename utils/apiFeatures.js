class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Handle simple DB quesrying and returns documents matching query.
  filter() {
    const queryObj = { ...this.queryString };
    const exculdedFields = [
      'page',
      'limit',
      'sort',
      'random',
      'size',
      'courses',
      'departments',
      'fields'
    ];
    exculdedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query.match(JSON.parse(queryStr));
    return this;
  }

  // Select random 'n' number of documents from the match returned.
  randomDoc() {
    if (this.queryString.random) {
      const count = this.queryString.random * 1;
      this.query.sample(count);
    }
    return this;
  }

  // Select n number of documents in a serial manner.
  limitDoc() {
    if (this.queryString.size) {
      const count = this.queryString.size * 1;
      this.query.limit(count);
    } else {
      this.query.limit(10);
    }
    return this;
  }

  // Sort random selection by url parsed document field.
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  // sets or removes fields of a document
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.project(fields);
    }
    return this;
  }

  course() {
    if (this.queryString.courses) {
      const courses = this.queryString.courses.split(',');
      this.query.match({ course: { $in: courses } });
    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;
