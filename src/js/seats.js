const filterSeats = data => {
  if (data.status === true) {
    const dataDate = Object.keys(data.testSeats)[0]
    const SeatsArr = data.testSeats[dataDate]
    const filteredSeatsArr = []
    for (const seat of SeatsArr) {
      if (seat.seatStatus) filteredSeatsArr.push(seat)
    }

    const availableSeatsNum = filteredSeatsArr.length
    if (availableSeatsNum) {
      data.testSeats[dataDate] = filteredSeatsArr
      data.availableSeatsNum = availableSeatsNum
      return data
    }
  }
  return null
}

export { filterSeats }
