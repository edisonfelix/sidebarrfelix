import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _apiKey: string = 'PoA11Z4PtDqRqoBBJ0lPsftKyKEtdMTN';

  private _servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _historial: string[] = [];

  public resultado: Gif[] = [];

  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    if (
      localStorage.getItem('historial') &&
      localStorage.getItem('resultados')
    ) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
      this.resultado = JSON.parse(localStorage.getItem('resultados')!);
    }

    // this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    // this.resultado = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarTermino(query: string): void {
    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.slice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('q', query)
      .set('limit', '10');

    this.http
      .get<SearchGifsResponse>(`${this._servicioUrl}/search?`, { params })
      .subscribe((resp) => {
        this.resultado = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultado));
      });

    //this._historial.push(query);

    // fetch(
    //   `https://api.giphy.com/v1/gifs/search?api_key=PoA11Z4PtDqRqoBBJ0lPsftKyKEtdMTN&q=dragon ball&limit=10`
    // ).then((response) => {
    //   response.json().then((resp) => {
    //     console.log(resp);
    //   });
    // });
  }
}
