class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  categories() {
    if (this.queryString.category) {
      const categorize = this.queryString.category
        .split(",")
        // eslint-disable-next-line no-new-object
        .map((query) => new Object({ plantType: query }));

      this.query = this.query.find({ $or: [...categorize] });
    }

    return this;
  }

  price() {
    if (this.queryString.price) {
      const price = this.queryString.price.split(",");
      this.query = this.query.find({ price: { $gte: price[0], $lte: price[1] } });
    }

    return this;
  }

  ratings() {
    if (this.queryString.ratings) {
      this.query = this.query.find({ ratings: { $gte: this.queryString.ratings } });
    }

    return this;
  }
}

module.exports = ApiFeatures;
