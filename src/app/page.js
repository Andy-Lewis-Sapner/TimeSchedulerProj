'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const [name, setName] = useState('')
    const [peopleList, setPeopleList] = useState([])
    const [location, setLocation] = useState('')
    const [locations, setLocations] = useState([])
    const [peoplePerSlot, setPeoplePerSlot] = useState(1)
    const [startDate, setStartDate] = useState(() => {
        const today = new Date(Date.now())
        return today.toISOString().split('T')[0]
    })
    const [days, setDays] = useState(1)
    const [startHour, setStartHour] = useState('08:00')
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPeople = localStorage.getItem('peopleList');
            if (savedPeople) {
                setPeopleList(JSON.parse(savedPeople));
            }
            const savedLocations = localStorage.getItem('locations');
            if (savedLocations) {
                setLocations(JSON.parse(savedLocations));
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("peopleList", JSON.stringify(peopleList))
        }
    }, [peopleList]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("locations", JSON.stringify(locations))
        }
    }, [locations]);

    const handleAddName = (e) => {
      e.preventDefault()
      if (name.trim()) {
          setPeopleList([...peopleList, name.trim()])
          setName('')
      }
    }

    const handleClearList = (e) => {
        setPeopleList([])
        localStorage.removeItem("peopleList")
    }

    const handleDeleteName = (index) => {
      setPeopleList(peopleList.filter((_, i) => i !== index))
    }

    const handleAddLocation = (e) => {
        e.preventDefault()
        if (location.trim()) {
            setLocations([...locations, location.trim()])
            setLocation('')
        }
    }

    const handleDeleteLocation = (index) => {
        setLocations(locations.filter((_, i) => i !== index))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (peopleList.length === 0) {
            alert('אנא הוסף לפחות אדם אחד')
            return
        }
        if (locations.length < peoplePerSlot) {
            alert('אנא הוסף מספיק שמות למקומות (לפי מספר המקומות שהגדרת)')
            return
        }
        router.push(
            `/schedule?people=${encodeURIComponent(JSON.stringify(peopleList))}&peoplePerSlot=${peoplePerSlot}&startDate=${startDate}&days=${days}&startHour=${encodeURIComponent(startHour)}&locations=${encodeURIComponent(JSON.stringify(locations))}`
        )
    }

    return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">הוספת אנשים ללוח זמנים</h1>
        <div className="w-full max-w-md border-2 border-blue-400 rounded-xl p-4 bg-white shadow-md">
      <form onSubmit={handleAddName} className="mb-4 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="הכנס שם"
            dir="rtl"
            spellCheck={false}
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            הוסף
          </button>
          <button
            type="button"
            onClick={handleClearList}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            נקה הכל
          </button>
      </form>
      <p className="text-center mb-4">מספר שמות: {peopleList.length}</p>
      {peopleList.length > 0 && (
          <div className="mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">רשימת אנשים:</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {peopleList.map((person, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded shadow"
                      >
                        <span className="ml-2">{person}</span>
                        <button
                            onClick={() => handleDeleteName(index)}
                            className="text-red-500 hover:text-red-700 font-bold"
                        >
                            X
                        </button>
                      </li>
                  ))}
              </ul>
          </div>
      )}

        <form onSubmit={handleAddLocation} className="mb-4 flex gap-2">
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס מיקום"
                dir="rtl"
                spellCheck={false}
            />
            <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
                הוסף
            </button>
        </form>
        <p className="text-center mb-4">מספר מקומות: {locations.length}</p>

        {locations.length > 0 && (
            <div className="mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h2 className="text-lg font-semibold mb-2">רשימת מקומות:</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {locations.map((loc, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between bg-white p-2 rounded shadow"
                        >
                            <span className="ml-2">{loc}</span>
                            <button
                                onClick={() => handleDeleteLocation(index)}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  תאריך התחלה:
              </label>
              <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
          <div className="mb-4">
              <label htmlFor="days" className="block text-gray-700 mb-2">
                  מספר ימים:
              </label>
              <input
                  id="days"
                  type="number"
                  value={days}
                  onChange={(e) => {
                      if (e.target.value === "") setDays(1)
                      else setDays(Math.max(1, parseInt(e.target.value)))
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  dir="rtl"
              />
          </div>
          <div className="mb-4">
              <label htmlFor="startHour" className="block text-gray-700 mb-2">
                  שעת התחלה:
              </label>
              <input
                  id="startHour"
                  type="time"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
            <div className="mb-4">
                <label htmlFor="peoplePerSlot" className="block text-gray-700 mb-2">
                    מספר מקומות רצוי:
                </label>
                <input
                    id="peoplePerSlot"
                    type="number"
                    value={peoplePerSlot}
                    onChange={(e) => {
                        if (e.target.value === "") setPeoplePerSlot(1)
                        else setPeoplePerSlot(Math.max(1, parseInt(e.target.value)))
                    }}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    dir="rtl"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                צור לוח זמנים
            </button>
      </form>
        </div>
    </div>
    )
}
