export interface Rating{
  rate: number;
  count: number;
}

export class Product{
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public description: string,
    public category: string,
    public imageUrl: string,
    public rating: Rating,
    public quantitySold: number = 0
  ){}
}
