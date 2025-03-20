'use client'

import { useSearchParams } from "next/navigation";
import ScheduleTable from "@/components/ScheduleTable";
import { Suspense } from "react";

function ScheduleContent() {
    const searchParams = useSearchParams()
    const people = searchParams.get("people")
    const peoplePerSlot = searchParams.get("peoplePerSlot")
    const startDate = searchParams.get("startDate")
    const startHour = searchParams.get("startHour")
    const endDate = searchParams.get('endDate');
    const endHour = searchParams.get('endHour');
    const locations = searchParams.get("locations")

    if (!people || !peoplePerSlot || !startDate || !startHour || !endDate || !endHour || !locations) {
        return <p className="text-center">טוען...</p>
    }

    const peopleList = JSON.parse(decodeURIComponent(people))
    const locationList = JSON.parse(decodeURIComponent(locations))
    const schedule = createSchedule(
        peopleList.length,
        parseInt(peoplePerSlot),
        peopleList,
        startDate,
        decodeURIComponent(startHour),
        endDate,
        decodeURIComponent(endHour),
    )

    const formattedDate = formatSimpleDate(startDate)

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">לוח זמנים - {formattedDate}</h1>
            <ScheduleTable schedule={schedule} locations={locationList} />
            <button
                onClick={() => window.location.href = '/'}
                className="mt-6 w-full max-w-md mx-auto block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                חזור להוספת אנשים
            </button>
        </div>
    )
}

function createSchedule(num_people, people_per_slot, peopleList, start_date, start_hour, end_date, end_hour) {
    const [startHour] = start_hour.split(':').map(Number)
    const [endHour] = end_hour.split(':').map(Number)
    const base_date = new Date(`${start_date}T${startHour.toString().padStart(2, '0')}:00:00`)
    const end_date_time = new Date(`${end_date}T${endHour.toString().padStart(2, '0')}:00:00`)

    const time_diff = end_date_time - base_date
    const total_slots = Math.floor(time_diff / (4 * 60 * 60 * 1000))
    const gap_slots = 2

    if (total_slots <= 0) {
        return "שגיאה: משך הזמן קצר מדי ליצירת משבצות"
    }

    const time_slots = []
    for (let i = 0; i < total_slots; i++) {
        const start_time = new Date(base_date.getTime() + i * 4 * 60 * 60 * 1000)
        const end_time = new Date(start_time.getTime() + 4 * 60 * 60 * 1000)

        const startDateStr = start_time.toISOString().split('T')[0];
        const startHourStr = start_time.getHours().toString().padStart(2, '0');
        const startMinuteStr = start_time.getMinutes().toString().padStart(2, '0');
        const endHourStr = end_time.getHours().toString().padStart(2, '0');
        const endMinuteStr = end_time.getMinutes().toString().padStart(2, '0');
        const endDateStr = end_time.toISOString().split('T')[0];

        const slot = startDateStr === endDateStr
            ? `${startDateStr} ${startHourStr}:${startMinuteStr} - ${endHourStr}:${endMinuteStr}`
            : `${startDateStr} ${startHourStr}:${startMinuteStr} - ${endDateStr} ${endHourStr}:${endMinuteStr}`

        time_slots.push(slot)
    }
    
    if (num_people < people_per_slot) return "שגיאה: אין מספיק אנשים למילוי כל משבצת"

    const shuffledPeople = [...peopleList].sort(() => 0.5 - Math.random())

    const schedule = Object.fromEntries(time_slots.map(slot => [slot, []]))
    const last_assignment = Object.fromEntries(peopleList.map(person => [person, -gap_slots - 1]))

    time_slots.forEach((slot, slot_idx) => {
        let available_people = shuffledPeople.filter(
            person => slot_idx - last_assignment[person] > gap_slots
        )

        available_people.sort((a, b) => {
            const gapA = slot_idx - last_assignment[a]
            const gapB = slot_idx - last_assignment[b]
            return gapB - gapA
        })

        if (available_people.length >= people_per_slot) {
            const assigned = available_people.slice(0, people_per_slot)
            schedule[slot] = assigned
            assigned.forEach(person => {
                last_assignment[person] = slot_idx
            })
        }
    })

    return schedule;
}

function formatSimpleDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export default function Schedule() {
    return (
        <Suspense fallback={<p className="text-center">טוען...</p>}>
            <ScheduleContent />
        </Suspense>
    )
}