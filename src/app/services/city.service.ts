import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CityRecord {
  id: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  altitude: number;
}

@Injectable({ providedIn: 'root' })
export class CityService {
  private cities = signal<CityRecord[]>([]);
  private loaded = false;

  constructor(private http: HttpClient) {}

  load() {
    if (this.loaded) return;

    this.http
      .get('assets/data.csv', { responseType: 'text' })
      .subscribe(text => {
        this.cities.set(this.parse(text));
        this.loaded = true;
      });
  }

  getCoordinates(cityName: string) {
    console.log("Loading things");
    const city = this.cities().find(
      c => c.city === cityName.toLowerCase()
    );

    console.log(city);

    return city
      ? { lat: city.lat, lon: city.lon }
      : null;
  }

  private parse(data: string): CityRecord[] {
    return data
      .split('\n')
      .slice(1)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [id, country, city, lat, lon, altitude] = line.split(';');

        return {
          id,
          country,
          city: city.toLowerCase(),
          lat: Number(lat),
          lon: Number(lon),
          altitude: Number(altitude)
        };
      });
  }
}
