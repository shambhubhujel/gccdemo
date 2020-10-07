const url = 'http://54.79.196.224/api/v1';
const workBody = document.getElementById('workBody');

fetch(`${url}/vacancy`, {
  method: 'GET',
})
  .then((response) => response.json())
  .then((allVacancies) => {
    const vacancies = allVacancies.data;

    const output = vacancies.map((vacancy) => {
      return `
                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div class="htc__mission__container"
                        style="border-bottom: 1px solid #c3c3c3; padding: 10px 5px; margin-left: 5px; background:#fff;">
                        <div class="single__mission foo">
                            <div class="row">
                                <div class="col-md-4">
                                    <h3 class="text-medium text-left">${vacancy.title} <span
                                            class=" text-small text--theme">(${vacancy.jobType})</span></h3>
                                </div>
                                <div class="col-md-6 text-left">
                                    <p>${vacancy.description}</p>
                                </div>
                                <div class="col-md-2 text-right">
                                    <a href="applyForJobName.html?id=${vacancy._id}" class=" htc__btn" type="button">
                                        Apply Now
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                `;
    });
    workBody.innerHTML = output.join(' ');
  });
