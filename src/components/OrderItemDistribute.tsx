"use client";

import { Orders } from "@/database/models";
import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { randomInt } from "@/utils";
import { fire } from "@/utils/confettie";

export function OrderItemDistribute({
  gameList,
}: {
  gameList: Orders["items"];
}) {
  const [grid, setGrid] = useState<{
    placements: number[];
    maxDisplay: { columns: number; rows: number };
  }>({
    placements: [],
    maxDisplay: {
      columns: 0,
      rows: 0,
    },
  });

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setGrid((prev) => {
          const { width, height } = entry.contentRect;
          const columns = Math.floor(width / 150);
          const rows = Math.floor(height / 200);
          const newPlacements: number[] = [];
          const takenRows = rows % 2 === 0 ? 2 : 1;
          const takenCols = columns % 2 === 0 ? 2 : 3;
          const rowMid = Math.floor(rows / 2) - 1;
          const colMid = Math.floor(columns / 2) - 1;
          const {
            maxDisplay: { columns: prevCols, rows: prevRows },
          } = prev;
          const takenCells = [];
          if (columns !== prevCols || rows !== prevRows) {
            for (let i = 0; i < takenRows; i++) {
              const row = rowMid + i;
              for (let j = 0; j < takenCols; j++) {
                const col = colMid + j;
                takenCells.push(row * columns + col);
              }
            }
            const degree = 360 / (rows * columns);
            const distance = 360 / gameList.length;
            let d = Math.round(distance / degree);
            if (d % columns === 0 && d > 4) {
              d -= 4;
            }
            console.log({ d });
            for (let i = 0; i < gameList.length; i++) {
              let previous = newPlacements[i - 1];
              if (previous === undefined) {
                previous = 0;
                newPlacements.push(previous);
                continue;
              }
              let newCell = previous + d;
              // const pick = [-1, 1];
              // console.log({ previous, newCell });
              // if (previous % columns === newCell % columns && d > 4) {
              //   let random = randomInt(0, 1);
              //   d = d - pick[random];
              //   newCell = previous + d;
              // }
              // if (previous % columns === newCell % columns) {
              //   let random = randomInt(-1, 1);
              //   while (random === 0) {
              //     random = randomInt(-1, 1);
              //   }
              //   newCell -= random;
              // }
              while (takenCells.includes(newCell)) {
                newCell += 1;
              }
              newPlacements.push(newCell);
            }

            return {
              placements: newPlacements,
              maxDisplay: { columns, rows },
            };
          }
          return prev;
        });
      }
    });

    const gameGrid = document.querySelector("#game-grid");
    if (!gameGrid) {
      return;
    }
    observer.observe(gameGrid);

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
    return () => {
      observer.disconnect();
    };
  }, [gameList]);

  return (
    <>
      {gameList.map((item, index) => {
        const { maxDisplay, placements } = grid;
        const cell = placements[index];
        const image = item.images.portrait;
        const shadowColor = image.colors.highestSat;
        const column = (cell % maxDisplay.columns) + 1;
        const row = Math.floor(cell / maxDisplay.columns) + 1;
        return (
          <Image
            key={item.ID}
            src={image.url}
            width={150}
            height={200}
            alt={item.name}
            title={item.name}
            className={
              "rounded z-[1] transition-transform " +
              "[--tw-shadow-colored:0_10px_25px_-3px_var(--tw-shadow-color),_0_-2px_10px_0px_var(--tw-shadow-color),_0_4px_6px_-4px_var(--tw-shadow-color)] " +
              "shadow-lg shadow-red-500 transition-opacity " +
              (cell === undefined ? "opacity-0 " : "")
            }
            data-cell={cell}
            style={{
              gridColumnStart: column,
              gridRowStart: row,
              transform: `rotate(${randomInt(-45, 45)}deg)`,
              boxShadow: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 10px 25px -3px rgb(${shadowColor}), 0 -2px 10px 0px rgb(${shadowColor}), 0 4px 6px -4px rgb(${shadowColor})`,
            }}
          />
        );
      })}
    </>
  );
}
