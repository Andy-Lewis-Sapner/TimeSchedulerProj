export default function ScheduleTable({ schedule, locations }) {
    if (typeof schedule === 'string') {
        return <p className="text-red-500 text-center my-2">{schedule}</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">תאריך</th>
                        <th className="py-2 px-4 border-b">שעה</th>
                        {locations.map((loc, i) => (
                            <th key={i} className="py-2 px-4 border-b text-center">{loc}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(schedule).map(([slot, people], index) => {
                        const parts = slot.split(' - ')
                        const [startDate, startTime] = parts[0].split(' ')
                        const endPart = parts[1].split(' ')
                        const endTime = endPart.length === 1 ? endPart[0] : endPart[1]
                        const displayDate = endPart.length === 1 ? startDate : endPart[0]
                        const displayTime = `${startTime} - ${endTime}`

                        return (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-center">{displayDate}</td>
                                <td className="py-2 px-4 border-b text-center">{displayTime}</td>
                                {locations.map((_, i) => (
                                    <td key={i} className="py-2 px-4 border-b text-center">
                                        {people[i] || '-'}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}