import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    return Math.round((weather.temperature * 9/5) + 32);
  });

  // Another computed signal for dynamic CSS classes
  weatherConditionClass = computed(() => {
    const weather = this.currentWeather();
    if (!weather) return '';
    return weather.condition.toLowerCase().replace(/\s+/g, '-');
  });

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

  // Search for weather using two-way bound signal
  searchWeather() {
    const city = this.searchCity().toLowerCase().trim();

    if (!city) {
      return;
    }

    // Simulate API call with loading state
    this.isLoading.set(true);

    setTimeout(() => {
      const weather = this.weatherDatabase[city];

      if (weather) {
        this.currentWeather.set(weather);
      } else {
        this.currentWeather.set({
          city: this.searchCity(),
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: 'Unknown',
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          icon: '🌍'
        });
      }

      this.isLoading.set(false);
    }, 800);
  }

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
