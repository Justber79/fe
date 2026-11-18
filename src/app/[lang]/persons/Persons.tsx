"use client";
import { useEffect, useState } from "react";

import { getLoginPath } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Person, { PersonType } from "./Person";

export default function Persons() {
  const [persons, setPersons] = useState<PersonType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/person", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error(`HTTP error! status: ${res.status}`);
          if (res.status === 401) {
            router.push(getLoginPath(window.location.pathname));
          }
          return [];
        }
      })
      .then(({ data }) => {
        setPersons(data);
      })
      .catch((err) => {
        console.error("Error fetching persons:", err);
      });
  }, [router]);

  return (
    <div className={styles["list-container"]}>
      <h1>Persons</h1>
      <ul>{persons && persons.length ? persons.map((person) => <Person key={person.id} person={person} />) : null}</ul>
    </div>
  );
}
