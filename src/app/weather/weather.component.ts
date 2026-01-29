import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CityService } from '../services/city.service';


interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// ===== STANDALONE COMPONENT (Angular 14+, NOT new in 21) =====
// Like React components - no NgModule needed, just import what you use
// React equivalent: Just export the component, import what you need
@Component({
  selector: 'app-weather',
  standalone: true,  // ← Makes this work like a React component (no module config needed)
  imports: [CommonModule, FormsModule],  // ← Like importing React components/hooks
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  constructor(private http: HttpClient, private cityService: CityService) { }

  private weatherCodeMap: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Cloudy',
    45: 'Fog',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    61: 'Rainy',
    63: 'Heavy Rain',
    71: 'Snow',
    80: 'Rain Showers'
  };

  private weatherIconMap: Record<number, string> = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    61: '🌧️',
    71: '❄️',
    80: '🌧️'
  };

  ngOnInit() {
    this.cityService.load();
  }
  // ===== SIGNALS (Angular 16+, NOT new in 21) =====
  // Like React's useState, but auto-tracks dependencies
  // React equivalent: const [searchCity, setSearchCity] = useState('')
  searchCity = signal('');

  // React equivalent: const [isLoading, setIsLoading] = useState(false)
  isLoading = signal(false);

  // React equivalent: const [currentWeather, setCurrentWeather] = useState(null)
  currentWeather = signal<WeatherData | null>(null);

  // ===== COMPUTED SIGNALS (Angular 16+, NOT new in 21) =====
  // Like React's useMemo, but automatically tracks dependencies (no dependency array needed!)
  // React equivalent: useMemo(() => { ... }, [currentWeather])
  temperatureF = computed(() => {
    const weather = this.currentWeather();
    if (!weather) return null;
    return Math.round((weather.temperature * 9 / 5) + 32);
  });

  // Another computed signal for dynamic CSS classes
  weatherConditionClass = computed(() => {
    const weather = this.currentWeather();
    if (!weather) return '';
    return weather.condition.toLowerCase().replace(/\s+/g, '-');
  });

  searchWeather() {
    console.log("Searching");
    const city = this.searchCity().toLowerCase().trim();
    if (!city) return;

    const coords = this.cityService.getCoordinates(city);
    if (!coords) return;

    this.isLoading.set(true);

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coords.lat}` +
      `&longitude=${coords.lon}` +
      `&current_weather=true`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log(res);
        const current = res.current_weather;

        this.currentWeather.set({
          city: this.searchCity(),
          temperature: current.temperature,
          condition:
            this.weatherCodeMap[current.weathercode] ?? 'Unknown',
          humidity: 0,
          windSpeed: current.windspeed,
          icon: '🌍'
        });

        this.isLoading.set(false);
      },
      error: () => {console.log("error"); this.isLoading.set(false)}
    });


  }

  // Mock weather database
  private weatherDatabase: { [key: string]: WeatherData } = {
    'london': {
      city: 'London',
      temperature: 15,
      condition: 'Cloudy',
      humidity: 75,
      windSpeed: 20,
      icon: '☁️'
    },
    'new york': {
      city: 'New York',
      temperature: 22,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 15,
      icon: '☀️'
    },
    'paris': {
      city: 'Paris',
      temperature: 18,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: '⛅'
    },
    'tokyo': {
      city: 'Tokyo',
      temperature: 25,
      condition: 'Clear',
      humidity: 55,
      windSpeed: 10,
      icon: '🌤️'
    },
    'sydney': {
      city: 'Sydney',
      temperature: 28,
      condition: 'Sunny',
      humidity: 50,
      windSpeed: 18,
      icon: '☀️'
    },
    'seattle': {
      city: 'Seattle',
      temperature: 12,
      condition: 'Rainy',
      humidity: 85,
      windSpeed: 25,
      icon: '🌧️'
    }
  };

  // Update search city (demonstrates two-way binding)
  onCityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchCity.set(input.value);
  }

  // Get available cities for quick selection
  getAvailableCities(): string[] {
    return Object.keys(this.weatherDatabase).map(city =>
      city.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    );
  }

  // Quick select city
  selectCity(city: string) {
    this.searchCity.set(city);
    this.searchWeather();
  }
}
