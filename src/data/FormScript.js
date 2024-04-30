const domReady = (fn)  => {
    //See if DOM is already available
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      //Call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  const companySearch = () => {
    window.addEventListener('message', event => {
      if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
        const input = document.querySelector('input[name="company"]')
        const hiddenCheck = document.querySelector('input[name="0-2/dossier_number"]')
  
        if (!input || !hiddenCheck) return
  
        let typeDelay
        let loader = document.createElement('div');
        
        loader.setAttribute('class', 'c-search-loader')
  
        input.parentElement.style.position = 'relative'
        hiddenCheck.parentElement.parentElement.style.display = 'none'
  
        input.addEventListener('input', e => {
          if (!e.isTrusted) return; // If the event is not triggered by the user but by JS, do not proceed
          clearTimeout(typeDelay)
          console.log(e.currentTarget.value)
          typeDelay = window.setTimeout(getCompanies, 600, e.currentTarget.value, input)
        })
  
        // Used to prevent reset to old value
        input.addEventListener('blur', e => {
          console.log(e.currentTarget.value)
          console.log(input.value)
          input.value = e.currentTarget.value
        })
  
        const getCompanies = (target, input) => {
          // If results allready exist, whipe those
          if (document.querySelector('.c-company-select')) {
            document.querySelector('.c-company-select').remove()
          }
  
          input.parentElement.appendChild(loader)
  
          window
            .fetch(`https://.herokuapp.com/get-companies?name=${encodeURIComponent(target)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'text/plain',
              },
            })
            .then(response => response.json())
            .then(result => {
              if (result.body.message) {
                loader.remove()
                hiddenCheck.value = 'Niet beschikbaar'
                hiddenCheck.dispatchEvent(new Event('input', { bubbles: true }));
              } else if (result.body.item) {
                generateSelect(result.body.item, input)
              }
            })
            .catch(error => {
              console.log(error)
              loader.remove()
              hiddenCheck.value = 'Niet beschikbaar'
              hiddenCheck.dispatchEvent(new Event('input', { bubbles: true }));
            })
        }
  
        const generateSelect = (items, input) => {
          input.setAttribute('autocomplete', 'off')
  
          let wrapper = document.createElement('div')
          wrapper.setAttribute('class', 'c-company-select')
  
          ;[...items].forEach(item => {
            let element = document.createElement('div')
            element.setAttribute('class', 'c-company-select__element')
            element.dataset.dossier = item.dossier_number
            element.dataset.name = item.name
            element.innerHTML = item.name
  
            const span = document.createElement('div')
            span.setAttribute('class', 'c-company-select__span')
            const city = item.establishment_city ? item.establishment_city : ''
            const street = item.establishment_street ? item.establishment_street : ''
            span.innerHTML = street + ', ' + city.toLowerCase()
  
            element.appendChild(span)
  
            element.addEventListener('click', e => {
              // Use jQuery because of HubSpot bug
              input.value = e.currentTarget.dataset.name
              input.dispatchEvent(new Event('input', { bubbles: true }));
  
              hiddenCheck.value = e.currentTarget.dataset.dossier
              hiddenCheck.dispatchEvent(new Event('input', { bubbles: true }));
              input.parentElement.removeChild(wrapper);
            })
  
            wrapper.appendChild(element)
            loader.remove()
          })
  
          input.parentElement.appendChild(wrapper)
        }
      }
    })
  }
  
  domReady(() => {
    companySearch()
  })