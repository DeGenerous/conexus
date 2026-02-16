/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Nullable<T> = T | null | undefined;

declare namespace App {
  interface Locals {
    user: User;
  }
}
