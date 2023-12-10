/* sophisticated_code.js */

// This code is a complex implementation of a data structure called a skip list.
// A skip list is a probabilistic data structure that allows for efficient search and insertion operations.
// The implementation includes multiple levels, each with an index and pointers to adjacent nodes.
// This skip list is designed to store integers in ascending order.

class SkipListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.down = null;
  }
}

class SkipList {
  constructor() {
    this.head = new SkipListNode(Number.MIN_SAFE_INTEGER);
    this.tail = new SkipListNode(Number.MAX_SAFE_INTEGER);
    this.head.next = this.tail;
    this.levels = 1;
  }

  flipCoin() {
    return Math.random() < 0.5;
  }

  insert(value) {
    const newNode = new SkipListNode(value);
    let current = this.head;

    const update = [];
    while (current) {
      while (current.next && current.next.value < value) {
        current = current.next;
      }
      update.push(current);
      current = current.down;
    }

    let insertLevel = 0;
    let shouldPromote = true;

    while (shouldPromote) {
      update.pop();
      if (insertLevel >= this.levels) {
        const newHeadNode = new SkipListNode(Number.MIN_SAFE_INTEGER);
        const newTailNode = new SkipListNode(Number.MAX_SAFE_INTEGER);
        newHeadNode.next = newTailNode;
        newHeadNode.down = this.head;
        newTailNode.down = this.tail;
        this.head = newHeadNode;
        this.tail = newTailNode;
        this.levels++;
      }

      const insertNode = update[update.length - 1];
      newNode.next = insertNode.next;
      insertNode.next = newNode;

      if (insertLevel > 0) {
        newNode.down = prevNode;
        prevNode = newNode;
      }

      shouldPromote = this.flipCoin();
      if (shouldPromote) {
        if (insertLevel >= this.levels - 1) {
          const newHeadNode = new SkipListNode(Number.MIN_SAFE_INTEGER);
          const newTailNode = new SkipListNode(Number.MAX_SAFE_INTEGER);
          newHeadNode.next = newTailNode;
          newHeadNode.down = this.head;
          newTailNode.down = this.tail;
          this.head = newHeadNode;
          this.tail = newTailNode;
          this.levels++;
        }

        const newUpNode = new SkipListNode(value);
        newNode.up = newUpNode;
        newUpNode.next = newNode;
        newUpNode.down = prevNode;
        newNode = newUpNode;
      }

      insertLevel++;
    }
  }

  search(value) {
    let current = this.head;
    while (current) {
      while (current.next && current.next.value <= value) {
        if (current.next.value === value) return true;
        current = current.next;
      }
      current = current.down;
    }
    return false;
  }

  remove(value) {
    let current = this.head;

    const update = [];
    while (current) {
      while (current.next && current.next.value < value) {
        current = current.next;
      }
      update.push(current);
      current = current.down;
    }

    const target = update[update.length - 1].next;
    if (target && target.value === value) {
      let currentLevel = 0;
      while (currentLevel < this.levels) {
        if (update[currentLevel].next === target) {
          update[currentLevel].next = target.next;
        }
        currentLevel++;
      }
      return true;
    }
    return false;
  }
}

// Example usage:

const skipList = new SkipList();
skipList.insert(3);
skipList.insert(5);
skipList.insert(1);
skipList.insert(10);
console.log(skipList.search(5)); // Outputs: true
console.log(skipList.search(2)); // Outputs: false
skipList.remove(5);
console.log(skipList.search(5)); // Outputs: false