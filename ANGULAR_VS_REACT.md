# Angular 21 vs React 19: Side-by-Side Comparison

This document shows how the same features are implemented in Angular 21 vs React 19.

---

## 1. Basic Component Setup

### Angular 21
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  // Component logic here
}
```

### React 19
```jsx
import React, { useState } from 'react';
import './WeatherComponent.css';

export function WeatherComponent() {
  // Component logic here
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

**Key Differences:**
- Angular separates template (HTML) from logic (TypeScript)
- React combines them in JSX
- Angular requires decorator with metadata
- React is just a function

---

## 2. State Management

### Angular 21 (Signals)
```typescript
// Create state
searchCity = signal('');
isLoading = signal(false);
weatherData = signal<Weather | null>(null);

// Read state
console.log(this.searchCity());       // Call as function
console.log(this.isLoading());

// Update state
this.searchCity.set('London');
this.isLoading.set(true);
this.weatherData.set(newData);

// Update based on previous value
this.isLoading.update(prev => !prev);
```

### React 19 (useState)
```jsx
// Create state
const [searchCity, setSearchCity] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [weatherData, setWeatherData] = useState(null);

// Read state
console.log(searchCity);              // Direct access
console.log(isLoading);

// Update state
setSearchCity('London');
setIsLoading(true);
setWeatherData(newData);

// Update based on previous value
setIsLoading(prev => !prev);
```

**Key Differences:**
- Angular: Read with `signal()`, write with `signal.set()`
- React: Read directly, write with setter function
- Both: Can update based on previous value
- Angular: Signals auto-track dependencies (see next section)

---

## 3. Computed/Derived State

### Angular 21 (computed)
```typescript
// Automatically tracks currentWeather dependency
temperatureF = computed(() => {
  const weather = this.currentWeather();
  if (!weather) return null;
  return Math.round((weather.temperature * 9/5) + 32);
});

// Use it
console.log(this.temperatureF());     // Auto-updates when currentWeather changes

// No dependency array needed
```

### React 19 (useMemo)
```jsx
// Must manually specify dependencies
const temperatureF = useMemo(() => {
  if (!currentWeather) return null;
  return Math.round((currentWeather.temperature * 9/5) + 32);
}, [currentWeather]);  // ← Must remember this!

// Use it
console.log(temperatureF);            // Auto-updates when currentWeather changes

// If you forget the dependency array, you'll get stale data 
```

**Key Differences:**
- Angular: **Automatic** dependency tracking
- React: **Manual** dependency tracking
- Angular: Read with `computed()`
- React: Read directly (it's already a value)

---

## 4. Two-Way Data Binding (Form Input)

### Angular 21 (Signal-based)
```typescript
// Component
searchCity = signal('');

onCityInput(event: Event) {
  const input = event.target as HTMLInputElement;
  this.searchCity.set(input.value);
}
```
```html
<!-- Template -->
<input
  [value]="searchCity()"
  (input)="onCityInput($event)"
/>
<p>You typed: {{ searchCity() }}</p>
```

**Or use Angular's shorthand:**
```html
<input [(ngModel)]="searchCity" />
<p>You typed: {{ searchCity }}</p>
```

### React 19
```jsx
const [searchCity, setSearchCity] = useState('');

return (
  <>
    <input
      value={searchCity}
      onChange={(e) => setSearchCity(e.target.value)}
    />
    <p>You typed: {searchCity}</p>
  </>
);
```

**Key Differences:**
- Angular: Has `[(ngModel)]` shorthand for two-way binding
- React: Always explicit with value + onChange
- Both: Achieve the same result

---

## 5. Conditional Rendering

### Angular 21 (@if syntax)
```html
@if (currentWeather(); as weather) {
  <div class="weather-card">
    <h2>{{ weather.city }}</h2>
    <p>{{ weather.temperature }}°C</p>
  </div>
} @else {
  <div class="empty-state">
    <p>No weather data</p>
  </div>
}
```

### React 19
```jsx
{currentWeather ? (
  <div className="weather-card">
    <h2>{currentWeather.city}</h2>
    <p>{currentWeather.temperature}°C</p>
  </div>
) : (
  <div className="empty-state">
    <p>No weather data</p>
  </div>
)}
```

**Key Differences:**
- Angular: Uses `@if/@else` blocks (HTML-like)
- React: Uses JavaScript ternary operator or `&&`
- Both: Support the same logic, different syntax

---

## 6. List Rendering

### Angular 21 (@for syntax)
```html
@for (city of cities; track city) {
  <button (click)="selectCity(city)">
    {{ city }}
  </button>
}
```

### React 19
```jsx
{cities.map(city => (
  <button key={city} onClick={() => selectCity(city)}>
    {city}
  </button>
))}
```

**Key Differences:**
- Angular: Uses `@for` with `track` for optimization
- React: Uses `.map()` with `key` for optimization
- Both: Require unique identifiers for performance

---

## 7. Local Template Variables (NEW in Angular 21!)

### Angular 21 (@let directive)
```html
<div class="details">
  @let humidityLevel = weather.humidity > 70 ? 'High' : 'Low';
  @let windStrength = weather.windSpeed > 20 ? 'Strong' : 'Light';

  <p>Humidity: {{ weather.humidity }}% ({{ humidityLevel }})</p>
  <p>Wind: {{ weather.windSpeed }} km/h ({{ windStrength }})</p>
</div>
```

### React 19
```jsx
// Just use const - React has always allowed this
const humidityLevel = weather.humidity > 70 ? 'High' : 'Low';
const windStrength = weather.windSpeed > 20 ? 'Strong' : 'Light';

return (
  <div className="details">
    <p>Humidity: {weather.humidity}% ({humidityLevel})</p>
    <p>Wind: {weather.windSpeed} km/h ({windStrength})</p>
  </div>
);
```

**Key Differences:**
- Angular: **NEW in 21!** Previously had to create component methods
- React: Could always do this (JSX is JavaScript)
- Angular is catching up to React's flexibility

---

## 8. Event Handling

### Angular 21
```html
<!-- Template -->
<button (click)="searchWeather()">Search</button>
<button (click)="selectCity('London')">London</button>
<input (input)="onInput($event)" />
<input (keyup.enter)="onEnter()" />
```

```typescript
// Component
searchWeather() {
  console.log('Searching...');
}

selectCity(city: string) {
  console.log('Selected:', city);
}
```

### React 19
```jsx
<button onClick={searchWeather}>Search</button>
<button onClick={() => selectCity('London')}>London</button>
<input onInput={(e) => onInput(e)} />
<input onKeyDown={(e) => e.key === 'Enter' && onEnter()} />
```

**Key Differences:**
- Angular: `(eventName)` syntax in template
- React: `onEventName` props in JSX
- Angular: Has shortcuts like `(keyup.enter)`
- React: Must check `e.key === 'Enter'` manually

---

## 9. Styling

### Angular 21
```typescript
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']  // Scoped to component
})
```

```scss
// weather.component.scss - automatically scoped
.weather-card {
  background: blue;

  .city-name {
    color: white;
  }
}
```

### React 19
```jsx
import './WeatherComponent.css';  // Global by default

// Or use CSS Modules
import styles from './WeatherComponent.module.css';

// Or CSS-in-JS
const weatherCardStyle = {
  background: 'blue'
};

return <div style={weatherCardStyle}>...</div>;
```

**Key Differences:**
- Angular: Component styles are **scoped by default**
- React: CSS is **global by default** (need CSS Modules or CSS-in-JS for scoping)
- Angular: Enforces style encapsulation
- React: More flexible, more choices

---

## 10. Lifecycle & Side Effects

### Angular 21
```typescript
import { Component, OnInit, OnDestroy, effect } from '@angular/core';

export class WeatherComponent implements OnInit, OnDestroy {
  searchCity = signal('');

  // Runs once on component creation
  ngOnInit() {
    console.log('Component initialized');
  }

  // Runs on component destruction
  ngOnDestroy() {
    console.log('Component destroyed');
  }

  // Runs whenever signal dependencies change (like useEffect)
  constructor() {
    effect(() => {
      const city = this.searchCity();
      console.log('City changed:', city);
      // Auto-tracks searchCity, no dependency array!
    });
  }
}
```

### React 19
```jsx
import { useState, useEffect } from 'react';

export function WeatherComponent() {
  const [searchCity, setSearchCity] = useState('');

  // Runs after every render (by default)
  useEffect(() => {
    console.log('Component rendered');
  });

  // Runs once on mount
  useEffect(() => {
    console.log('Component mounted');

    return () => {
      console.log('Component unmounted');
    };
  }, []);  // Empty dependency array

  // Runs when searchCity changes
  useEffect(() => {
    console.log('City changed:', searchCity);
  }, [searchCity]);  // Must specify dependency
}
```

**Key Differences:**
- Angular: Separate lifecycle methods + `effect()` for reactive code
- React: `useEffect()` for everything
- Angular: `effect()` auto-tracks dependencies
- React: Must specify dependencies manually

---

## Summary: When to Choose Which?

### Choose Angular if:
- ✅ You want a **complete framework** (routing, forms, HTTP, etc. included)
- ✅ You prefer **strong opinions** and structure
- ✅ You want **automatic dependency tracking** (signals)
- ✅ Your team likes **separation** of HTML/CSS/TypeScript
- ✅ You're building **enterprise applications**
- ✅ You want **built-in form validation** and two-way binding

### Choose React if:
- ✅ You want a **lightweight library** (add what you need)
- ✅ You prefer **flexibility** and choice
- ✅ You like **JSX** (HTML in JavaScript)
- ✅ You want the **largest ecosystem** of libraries
- ✅ You're building **flexible UIs** or need server components
- ✅ You want **easier learning curve** (just JavaScript)

---

## The Bottom Line

**Angular 21 is heavily inspired by React:**
- `@if/@for` looks like JSX conditionals and loops
- `@let` brings React's inline variable declarations to Angular
- Standalone components remove NgModule boilerplate (more like React's simplicity)
- Signals add auto-tracking (React doesn't have this!)

**Both frameworks are converging** on similar patterns while keeping their unique strengths. Choose based on your team's preferences and project requirements, not because one is "better" than the other.
