const domReady = (fn) => {
  // See if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

const companySearch = () => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
      const input = document.querySelector('input[name="company"]');
      const hiddenCheckDossier = document.querySelector('input[name="0-2/dossier_number"]');
      const hiddenCheckEstablishment = document.querySelector('input[name="0-2/establishment_number"]');
      const portalId = event.source.hsVars.portal_id

      if (!input || !hiddenCheckDossier || !hiddenCheckEstablishment) return;

      let typeDelay;
      const loader = document.createElement('div');

      loader.setAttribute('class', 'c-search-loader');

      input.parentElement.style.position = 'relative';
      hiddenCheckDossier.parentElement.parentElement.style.display = 'none';
      hiddenCheckEstablishment.parentElement.parentElement.style.display = 'none';

      input.addEventListener('input', (e) => {
        if (!e.isTrusted) return; // If the event is not triggered by the user but by JS, do not proceed
        clearTimeout(typeDelay);
        console.log(e.currentTarget.value);
        typeDelay = window.setTimeout(getCompanies, 600, e.currentTarget.value, input);
      });

      // Used to prevent reset to old value
      input.addEventListener('blur', (e) => {
        console.log(e.currentTarget.value);
        console.log(input.value);
        input.value = e.currentTarget.value;
      });

      // const getCompanies = (target, input) => {
      //   // If results allready exist, whipe those
      //   if (document.querySelector('.c-company-select')) {
      //     document.querySelector('.c-company-select').remove();
      //   }

      //   input.parentElement.appendChild(loader);

      //   window
      //       fetch(`https://company-info-bright-c6c99ec34e11.herokuapp.com/companies/webhook?name=${encodeURIComponent(target)}&portalId=${encodeURIComponent(portalId)}`, {
      //         method: 'GET',
      //         headers: {
      //           'Content-Type': 'text/plain',
      //         },
      //       })
      //       .then((response) => response.json())
      //       .then((result) => {
      //         console.log(result);
      //         if (result.body.message) {
      //           loader.remove();
      //           hiddenCheckDossier.value = 'Niet beschikbaar';
      //           hiddenCheckEstablishment.value = 'Niet beschikbaar';
      //           hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
      //           hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
      //         } else if (result.body.item) {
      //           generateSelect(result.body.item, input);
      //         }
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //         loader.remove();
      //         hiddenCheckDossier.value = 'Niet beschikbaar';
      //         hiddenCheckEstablishment.value = 'Niet beschikbaar';
      //         hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
      //         hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
      //       });
      // };

      const getCompanies = (target, input) => {
        // If results already exist, wipe those
        if (document.querySelector('.c-company-select')) {
          document.querySelector('.c-company-select').remove();
        }
      
        input.parentElement.appendChild(loader);
      
        window
          .fetch(`https://company-info-bright-c6c99ec34e11.herokuapp.com/companies/webhook?name=${encodeURIComponent(target)}&portalId=${encodeURIComponent(portalId)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then(async (response) => {
            console.log('response')
            console.log('response')
            console.log('response')
            console.log('response')
            console.log('response')
            console.log(response)
            const text = await response.text();
            console.log('Raw response:', text);
      
            try {
              console.log('test')
              const result = JSON.parse(text);
              console.log('Parsed response:', result);
      
              if (result.body.message) {
                loader.remove();
                hiddenCheckDossier.value = 'Niet beschikbaar';
                hiddenCheckEstablishment.value = 'Niet beschikbaar';
                hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
                hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
              } else if (result.body.item) {
                generateSelect(result.body.item, input);
              }
            } catch (error) {
              console.error('Failed to parse JSON:', error);
              loader.remove();
              hiddenCheckDossier.value = 'Niet beschikbaar';
              hiddenCheckEstablishment.value = 'Niet beschikbaar';
              hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
              hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
            }
          })
          .catch((error) => {
            console.error('Fetch error:', error);
            loader.remove();
            hiddenCheckDossier.value = 'Niet beschikbaar';
            hiddenCheckEstablishment.value = 'Niet beschikbaar';
            hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
            hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
          });
      };

      const generateSelect = (items, input) => {
        input.setAttribute('autocomplete', 'off');

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'c-company-select')

        ;[...items].forEach((item) => {
          const element = document.createElement('div');
          element.setAttribute('class', 'c-company-select__element');
          element.dataset.dossier = item.dossier_number;
          element.dataset.establishment = item.establishment_number;
          element.dataset.name = item.name;
          element.innerHTML = item.name;

          const span = document.createElement('div');
          span.setAttribute('class', 'c-company-select__span');
          const city = item.establishment_city ? item.establishment_city : '';
          const street = item.establishment_street ? item.establishment_street : '';
          span.innerHTML = street + ', ' + city.toLowerCase();

          element.appendChild(span);

          element.addEventListener('click', (e) => {
            // Use jQuery because of HubSpot bug
            input.value = e.currentTarget.dataset.name;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            hiddenCheckDossier.value = e.currentTarget.dataset.dossier;
            hiddenCheckEstablishment.value = e.currentTarget.dataset.establishment;
            hiddenCheckEstablishment.dispatchEvent(new Event('input', { bubbles: true }));
            hiddenCheckDossier.dispatchEvent(new Event('input', { bubbles: true }));
            input.parentElement.removeChild(wrapper);
          });

          wrapper.appendChild(element);
          loader.remove();
        });

        input.parentElement.appendChild(wrapper);
      };
    }
  });
};

domReady(() => {
  companySearch();
});
