import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'


interface User {
  userId: number;
  token: string;
  isLoggedIn: boolean;
  previous: string;
  name: string;
  logout: () => void;
  login: (userId: number, token: string) => void;
  weakLogin: (userId: number, token: string) => void;
  setPrevious: (previous: string) => void;
  setName: (name: string) => void;
}


// const getLocalUserId = (key: string): number => JSON.parse(window.localStorage.getItem(key) as string);
// const setLocalUserId = (key: string, value:number) => window.localStorage.setItem(key, JSON.stringify(value));

// const getLocalToken = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
// const setLocalToken = (key: string, value:string) => window.localStorage.setItem(key, JSON.stringify(value));

// const getLocalIsLoggedIn = (key: string): boolean => JSON.parse(window.localStorage.getItem(key) as string);
// const SetLocalIsLoggedIn = (key: string, value:boolean) => window.localStorage.setItem(key, JSON.stringify(value));

// export const userStore = create<User>((set) => ({
//       userId: getLocalUserId("userId") || 0,
//       token: getLocalToken("token") || "",
//       isLoggedIn: getLocalIsLoggedIn("isLoggedIn") || false,
//       logout: () => set(() => 
//       setLocalUserId("userId", 0) 
//       return {"userId", userId}
//     ),
//       login: (userId: number, token: string) => set({userId: userId, token: token, isLoggedIn: true}),

//     }),
//     {
//       name: 'user', // name of the item in the storage (must be unique)
//     },
//   ),
// )

export const userStore = create<User>()(
  devtools(
    persist(
      (set) => ({
        userId: 0,
        token: "",
        isLoggedIn: false,
        previous: "",
        name: "",
        logout: () => set(() => ({userId: 0, token: "", isLoggedIn: false})),
        login: (userId: number, token: string) => set(() => ({userId: userId, token: token, isLoggedIn: true})),
        weakLogin: (userId: number, token: string) => set(() => ({userId: userId, token: token, isLoggedIn: false})),
        setPrevious: (previous: string) => set(() => ({previous: previous})),
        setName: (name: string) => set(() => ({name: name}))
      }),
      {name: "userStore"}
    )
  )
)