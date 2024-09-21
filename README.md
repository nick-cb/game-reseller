# Game reseller

A game reseller website inspired by the sleek and responsive design of the Epic Game Store. It's tailored to look and perform exceptionally well on desktops, mobile devices, tablets, and more. Browse our extensive game library effortlessly and discover your next gaming experience in style.

# Runing this project locally

```
git clone https://github.com/nick-cb/game-reseller.git
cd game-reseller
npm install
npm run dev
```

You also need to update .env file before run `npm run dev`

# Project goals

The following are some of the things I want to get a better understading in no particular order

- Test React Server Component (RSC)
  - Test data fetching in RSC
  - Test data fetching with `use`
  - Test how component composition work in RSC (server component, client component, share component...)
  - Test container - children pattern in rsc
  - Test new React 18 features such as transition, concurrent react, optimistic update...
- Test Next.js 13 features
  - New app router
  - Parallel Routes
  - Intercepting Routes
  - Server actions
- Test css features
  - Container query
  - Subgrid
  - Animations
  - Layers
- And more...

# Show cases

visit [game-reseller.vercel.app](https://game-reseller.vercel.app/) to try it yourself

<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.07.14.webm?alt=media&token=c895ce30-1f76-4315-9bd4-c7db7879a247" />
</video>

- Login modal render on the current layout using intercepting and parallel route
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.45.57.webm?alt=media&token=adfd0166-e35b-4385-aea2-cd961beff20f" />
</video>

- Order modal and add to cart using server action
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.27.55.webm?alt=media&token=1b3ef373-fed9-405f-8224-ada719999322" />
</video>

- Cart page and checkout modal with RSC and server action
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2008.57.17.webm?alt=media&token=efd160ff-99c3-4014-9eb3-412c8877951a" />
</video>


# useSyncExternalStore
1. Every time the `callback` is called, it will call `getSnapshot`, if the data return by `getSnapshot` is different than
the data of the previous `getSnapshot` call, then a render will be schedule for the component that associate with the `callback`.

2. Everything in subcribe function must be synchronously, meaning that everything will be block until subcribe function is
finished, includes rendering.

3. `getSnapshot` is called everytime the component render

```jsx
const ref = useRef(null);
const [state, setState] = useState(0);

useEffect(() => {
    function click() {
        setState(state + 1);
    }
    ref.current?.addEventListener('click', click);
    return () => {
        ref.current?.removeEventListener('click', click);
    }
}, [state]);

<button ref={ref}>Click {state}!</button>
```


```jsx
// outside component
let data = 0;
// outside component

const ref = useRef(null);
const state = useSyncExternalStore(useCallback(function(callback) {
    function click() {
        data + 1;
        callback();
    }
    ref.current?.addEventListener('click', click);
    return () => {
        ref.current?.removeEventListener('click', click);
    }
}, []), () => data, () => data);

<button ref={ref}>Click {state}!</button>
```
