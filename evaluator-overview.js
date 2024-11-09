function goToPage(page) {
  window.location.href = page;
}


// 평가자 테이블의 행 클릭 이벤트 설정 함수
function setupEvaluatorTableClickEvents() {
  const evaluatorRows = document.querySelectorAll('.evaluator-table tbody tr');
  evaluatorRows.forEach(row => {
      row.addEventListener('click', function() {
          const evaluatorEmail = this.querySelector('td:first-child').textContent;
          goToEvaluatorPage(evaluatorEmail);
      });
  });
}

// 평가자 페이지로 이동하는 함수
function goToEvaluatorPage(evaluatorEmail) {
  console.log(`Going to ${evaluatorEmail}'s page`);
  // 실제 구현: 평가자 페이지로 이동
  window.location.href = `evaluator-details.html?email=${encodeURIComponent(evaluatorEmail)}`;
}

// 필터 토글 함수
function toggleFilter(filterId) {
  const filterContent = document.getElementById(filterId);
  filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
}

const evaluators = [
  'john.smith798@example.com',
  'emma.johnson955@yahoo.com',
  'michael.williams129@hotmail.com',
  'olivia.brown404@gmail.com',
  'william.jones196@outlook.com',
  'ava.davis274@example.com',
  'james.miller290@hotmail.com',
  'sophia.wilson764@example.com',
  'robert.taylor851@example.com',
  'isabella.anderson788@example.com',
  'david.thomas939@hotmail.com',
  'mia.martinez731@gmail.com',
  'joseph.garcia410@example.com',
  'charlotte.robinson597@yahoo.com',
  'charles.clark312@example.com',
  'amelia.rodriguez161@example.com',
  'daniel.lewis604@outlook.com',
  'harper.lee927@example.com',
  'matthew.walker311@hotmail.com',
  'evelyn.hall557@example.com',
  'andrew.allen113@hotmail.com',
  'abigail.young249@hotmail.com',
  'christopher.king208@example.com',
  'emily.wright264@example.com',
  'joshua.scott538@gmail.com',
  'elizabeth.green689@example.com',
  'ryan.baker895@example.com',
  'sofia.adams751@example.com',
  'kevin.nelson707@hotmail.com',
  'grace.hill747@yahoo.com'
];

const tbody = document.querySelector("#evaluatorTable tbody");

evaluators.forEach(email => {
  const row = document.createElement("tr");
  const dsScore = Math.floor(Math.random() * 101);
  const sqlScore = Math.floor(Math.random() * 101);
  const dsStatus = dsScore >= 70 ? "Pass" : "Fail";
  const sqlStatus = sqlScore >= 70 ? "Pass" : "Fail";

  row.innerHTML = `
      <td>${email}</td>
      <td>${dsScore}</td>
      <td>${dsStatus}</td>
      <td>${sqlScore}</td>
      <td>${sqlStatus}</td>
  `;
  tbody.appendChild(row);
});

document.addEventListener('DOMContentLoaded', setupEvaluatorTableClickEvents);
