import { get, writable, type Updater, type Writable } from 'svelte/store'

export function storable<T>(name: string, data: T): Writable<T> {
    // const savedValue = localStorage.getItem(`storable:${name}`);

    const savedValue = null

    const value = (savedValue == null) ? data : JSON.parse(savedValue);
    // localStorage.setItem(`storable:${name}`, JSON.stringify(value));

    const store = writable(value);
    const { subscribe, set } = store;

    return {
        subscribe,
        set: (value: T) => {
            localStorage.setItem(`storable:${name}`, JSON.stringify(value));
            set(value);
        },
        update: (cb: Updater<T>) => {
            const value = cb(get(store));

            localStorage.setItem(`storable:${name}`, JSON.stringify(value));
            set(value);
        }
    };
}
