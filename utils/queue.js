module.exports = class Queue {
  constructor() {
    this.queue = [];
  }

  addMethod(method) {
    return new Promise((resolve, reject) => {
      this.queue.push({ method, resolve, reject });

      if (this.queue.length === 1) {
        this.executeNext();
      }
    });
  }

  async executeNext() {
    const { method, resolve, reject } = this.queue[0];

    try {
      const result = await method();
      resolve(result);
    } catch (e) {
      reject(e);
    }

    this.queue.shift();

    if (this.queue.length > 0) {
      setTimeout(() => {
        this.executeNext();
      }, Math.random() * 1000 + 500);
    }
  }
};
