export class Repository<T> {
  private readonly items: Map<string, T>;

  constructor() {
    this.items = new Map();
  }

  create(id: string, item: T): void {
    this.items.set(id, item);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getOne(id: string): T {
    return this.items.get(id);
  }

  remove(id: string, returnVal?: null): void | null {
    this.items.delete(id);
    if (returnVal) return returnVal;
  }

  isExist(id: string): boolean {
    return this.items.has(id);
  }
}
