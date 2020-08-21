const filterSeats = data => {
  if (data.status === true) {
    const dataDate = Object.keys(data.testSeats)[0]
    const SeatsArr = data.testSeats[dataDate]
    const newSeatsArr = []
    for (const seat of SeatsArr) {
      if (seat.seatStatus) newSeatsArr.push(seat)
    }

    if (newSeatsArr.length) {
      data.testSeats[dataDate] = newSeatsArr
      return data
    }
  }
  return null
}

export { filterSeats }
