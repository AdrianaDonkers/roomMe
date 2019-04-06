// NEED SERVICE RELAY IF CORS IS NOT SUPPORTED
(() => {
  const setupEventListeners = () => {
    const flightSearchButton = $('#flightSearchButton')
    const carSearchButton = $('#carSearchButton')
    const hotelSearchButton = $('#hotelSearchButton')
    const flightOrigin = $('#flightOrigin')
    const carLocation = $('#carLocation')
    const carPickupDate = $('#carPickupDate')
    const carDropoffDate = $('#carDropoffDate')
    const hotelLocation = $('#hotelLocation')
    const checkInDate = $('#checkInDate')
    const checkOutDate = $('#checkOutDate')

    flightSearchButton.click(
      () => window.ApiService.searchFlights({
        origin: flightOrigin.val()
      }).then(result => displayFlights(result.results))
        .catch(() => $('.flightresults').empty().append(
          $('<div></div>')
            .addClass('col alert alert-danger')
            .text('Oops, something went wrong! It is possible your query is invalid.')
        ))
    )

    hotelSearchButton.click(
      () => window.ApiService.searchHotels({
        location: hotelLocation.val(),
        checkIn: checkInDate.val(),
        checkOut: checkOutDate.val()
      }).then(result => displayHotels(result.results))
        .catch(() => $('.hotelresults').empty().append(
          $('<div></div>')
            .addClass('col alert alert-danger')
            .text('Oops, something went wrong! It is possible your query is invalid.')
        ))
    )

    carSearchButton.click(
      () => window.ApiService.searchCars({
        location: carLocation.val(),
        pickup: carPickupDate.val(),
        dropoff: carDropoffDate.val()
      }).then(result => displayCars(result.results[0].cars))
        .catch(() => $('.carresults').empty().append(
          $('<div></div>')
            .addClass('col alert alert-danger')
            .text('Oops, something went wrong! It is possible your query is invalid.')
        ))
    )

    flightOrigin.bind('input', () => flightSearchButton.prop('disabled', !flightOrigin.val()))

    let enableDisableSubmitBtn = function(location, inDate, outDate, btn){
      let place = location.val().trim()
      let startDate = inDate.val().trim()
      let endDate = outDate.val().trim()
      let enableBtn = place.length !== 0 && endDate.length !== 0 && startDate.length !== 0
      btn.attr('disabled', !enableBtn)
    }

    carLocation.bind('input', () => enableDisableSubmitBtn(carLocation, carPickupDate, carDropoffDate, carSearchButton))
    carPickupDate.bind('input', () => enableDisableSubmitBtn(carLocation, carPickupDate, carDropoffDate, carSearchButton))
    carDropoffDate.bind('input', () => enableDisableSubmitBtn(carLocation, carPickupDate, carDropoffDate, carSearchButton))

    hotelLocation.bind('input', () => enableDisableSubmitBtn(hotelLocation, checkInDate, checkOutDate, hotelSearchButton))
    checkInDate.bind('input', () => enableDisableSubmitBtn(hotelLocation, checkInDate, checkOutDate, hotelSearchButton))
    checkOutDate.bind('input', () => enableDisableSubmitBtn(hotelLocation, checkInDate, checkOutDate, hotelSearchButton))

  }

  const flightResults = listFlights => $('<li></li>').addClass('list-group-item').text("DESTINATION: " +
    listFlights.destination + "; PRICE: $" + listFlights.price + "; DEPARTURE DATE: " + listFlights.departure_date +
    "; RETURN DATE: " + listFlights.return_date)

  const hotelResults = listHotels => $('<li></li>').addClass('list-group-item').text("PROPERTY NAME: " +
    listHotels.property_name + "; ADDRESS: " + listHotels.address.line1 + ", " + listHotels.address.city +
    ", " + listHotels.address.region + "; TOTAL PRICE: $" + listHotels.total_price.amount)

  const carResults = listCars => $('<li></li>').addClass('list-group-item').text(
    "AVAILABLE CAR: " + listCars.vehicle_info.category + listCars.vehicle_info.type +
    "; ESTIMATED TOTAL PRICE: " + listCars.estimated_total.amount)

  const displayFlights = appendFlights => $('.flightresults').empty().append(
    appendFlights.map(flightResults)
  )

  const displayHotels = appendHotels => $('.hotelresults').empty().append(
    appendHotels.map(hotelResults)
  )

  const displayCars = appendCars => $('.carresults').empty().append(
    appendCars.map(carResults)
  )

  const init = () => {
    window.ApiService.apiHost('https://sandbox.amadeus.com/api-catalog')
    setupEventListeners()
  }

  (($) => {
    $.fn.slide = function () {
      const $this = this

      let $current = null
      let yPosition = 0

      $this.addClass("slide").mousedown(function (event) {
        $current = $(this)
        yPosition = event.screenY + ($current.data('slide-position') || 0)
      })


      $(document).mousemove(event => {
        if ($current) {
          const newPosition = Math.max(Math.min(event.screenY - yPosition, 0), -340)
          const newCss = `translateY(${newPosition}px)`

          $current.css({
            'transform': newCss
          }).data({
            'slide-position': newPosition
          })

          if (newPosition > -100) {
            $('#description').css('background', 'white')
          } else if (newPosition <= -100 && newPosition > -200) {
            $('#description').css('background', 'Aquamarine')
          } else if (newPosition <= -200 && newPosition > -270) {
            $('#description').css('background', 'lime')
          } else {
            $('#description').css('background', 'magenta')
          }

        }
      }).mouseup(() => {
        $current = null
      })

      return $this
    }
  })(jQuery)

  $('.slide-this').slide()

  window.AdventureHuntSearchController = {
    init
  }
})()
