function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-button');

  tabs.forEach(tab => tab.style.display = 'none');
  buttons.forEach(button => button.classList.remove('active'));

  const selectedTab = document.getElementById(tabId);
  const selectedButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);

  if (selectedTab) {
      selectedTab.style.display = 'block';
  }
  if (selectedButton) {
      selectedButton.classList.add('active');
  }

  if (tabId === 'overview') {
      showSubTab('ds'); // Overview 탭에서 기본적으로 Data Science 탭 표시
  }
}

function showSubTab(subTabId) {
  const subTabs = document.querySelectorAll('.sub-tab');
  const subButtons = document.querySelectorAll('.tab-buttons .tab-button');
  
  // 모든 서브 탭을 숨깁니다.
  subTabs.forEach(tab => tab.style.display = 'none');
  
  // 모든 서브 탭 버튼의 active 클래스를 제거합니다.
  subButtons.forEach(button => button.classList.remove('active'));
  
  // 선택된 서브 탭을 표시합니다.
  const selectedSubTab = document.getElementById(subTabId);
  if (selectedSubTab) {
    selectedSubTab.style.display = 'block';
  }
  
  // 선택된 서브 탭 버튼에 active 클래스를 추가합니다.
  const selectedSubButton = document.querySelector(`[onclick="showSubTab('${subTabId}')"]`);
  if (selectedSubButton) {
    selectedSubButton.classList.add('active');
  }
  if (subTabId === 'sql') {
    const sqlTab = document.getElementById('sql');
    if (sqlTab) {
      const canvasIds = ['sqlScoreDistributionChart', 'sqlData_RetrievalChart', 'sqlData_FilteringChart', 'sqlJoinsChart', 'sqlAggregationsChart', 'sqlSubqueriesChart'];
      canvasIds.forEach(id => {
        if (!document.getElementById(id)) {
          const canvas = document.createElement('canvas');
          canvas.id = id;
          sqlTab.appendChild(canvas);
        }
      });
    }
  }

  
  // 해당 서브 탭의 데이터를 로드합니다.
  loadData(subTabId);
}


// 필터 토글 함수
function toggleFilter(filterId) {
  const filterContent = document.getElementById(filterId);
  filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
}

// 페이지 이동 함수
function goToPage(page) {
  window.location.href = page;
}

let charts = {};

function createChart(canvasId, type, data, options) {
    // 기존 차트가 있다면 제거합니다.
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with id ${canvasId} not found`);
        return;
    }
    const ctx = canvas.getContext('2d');

    charts[canvasId] = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });

    return charts[canvasId];
}

// 통계 업데이트 함수
function updateStats(field, testData, allData) {
  const calculateStats = (data) => {
      const average = data.reduce((a, b) => a + b, 0) / data.length;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const median = data.sort((a, b) => a - b)[Math.floor(data.length / 2)];
      return { average, max, min, median };
  };

  const testStats = calculateStats(testData);
  const allStats = calculateStats(allData);

  document.getElementById(`${field}Average`).innerHTML = `
      <span style="color: rgba(75, 192, 192, 1)">${testStats.average.toFixed(2)}</span>
      (<span style="color: rgba(255, 99, 132, 1)">${allStats.average.toFixed(2)}</span>)`;
  document.getElementById(`${field}Max`).innerHTML = `
      <span style="color: rgba(75, 192, 192, 1)">${testStats.max}</span>
      (<span style="color: rgba(255, 99, 132, 1)">${allStats.max}</span>)`;
  document.getElementById(`${field}Min`).innerHTML = `
      <span style="color: rgba(75, 192, 192, 1)">${testStats.min}</span>
      (<span style="color: rgba(255, 99, 132, 1)">${allStats.min}</span>)`;
  document.getElementById(`${field}Median`).innerHTML = `
      <span style="color: rgba(75, 192, 192, 1)">${testStats.median}</span>
      (<span style="color: rgba(255, 99, 132, 1)">${allStats.median}</span>)`;
}

// function createScoreDistributionChart(canvasId, label, testScores, allScores) {
//   const createData = (scores) => {
//     const data = [0, 0, 0, 0, 0];
//     scores.forEach(score => {
//       const index = Math.min(Math.floor(score / 20), 4);
//       data[index]++;
//     });
//     return data;
//   };

//   const data = {
//     labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
//     datasets: [
//       {
//         label: 'Test Candidates',
//         data: createData(testScores),
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderWidth: 2,
//         pointRadius: 5,
//         pointBackgroundColor: 'rgba(75, 192, 192, 1)',
//         fill: true
//       },
//       {
//         label: 'All Candidates',
//         data: createData(allScores),
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderWidth: 2,
//         pointRadius: 5,
//         pointBackgroundColor: 'rgba(255, 99, 132, 1)',
//         fill: true
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Number of Candidates'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Score Range'
//         }
//       }
//     },
//     plugins: {
//       legend: { display: true },
//       title: {
//         display: true,
//         text: label + ' Evaluation Candidates Score Distribution'
//       }
//     }
//   };

//   createChart(canvasId, 'line', data, options);
// }
function createScoreDistributionChart(canvasId, label, testScores, allScores) {
  const createPercentageData = (scores) => {
    const total = scores.length;
    const data = new Array(11).fill(0);
    scores.forEach(score => {
      const index = Math.min(Math.floor(score / 10), 10);
      data[index]++;
    });
    return data.map(count => (count / total) * 100);
  };

  const labels = Array.from({length: 11}, (_, i) => i * 10);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Test Candidates',
        data: createPercentageData(testScores),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4
      },
      {
        label: 'All Candidates',
        data: createPercentageData(allScores),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage of Candidates'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Score'
        },
        ticks: {
          callback: function(value, index) {
            return index * 10;
          }
        }
      }
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: label + ' Candidates Score Distribution'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
          }
        }
      }
    }
  };

  createChart(canvasId, 'line', data, options);
}

document.addEventListener('DOMContentLoaded', function () {
  showTab('overview');
  
  // Data Science와 SQL 탭 버튼에 이벤트 리스너 추가
  document.querySelector('[onclick="showSubTab(\'ds\')"]').addEventListener('click', () => showSubTab('ds'));
  document.querySelector('[onclick="showSubTab(\'sql\')"]').addEventListener('click', () => showSubTab('sql'));
});

function loadData(tabId) {
  if (tabId === 'ds') {
    // Data Science 데이터
    const dsScoresTest = [0, 14, 20, 33, 11, 45,50, 57, 55, 62, 64, 65, 65, 65, 70, 72, 74, 75, 80, 81, 82, 85, 90, 95];

    const dsScoresAll = [
      10, 11, 25,33, 36, 4, 44,50, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 
      87, 88, 90, 90, 92, 92, 95, 95, 96, 97, 98, 98, 99, 100, 100,74, 73
    ];
    
    const dsQuestionScoresTest = [
      [87, 88, 83, 74, 29],
      [3, 63, 38, 4, 12],
      [34, 21, 100, 99, 76]
    ];
    
    const dsQuestionScoresAll = [
      [23, 52, 83, 69, 93, 68, 3, 50, 4, 26, 88, 74, 29, 63, 38, 87, 88, 83, 74, 29],
      [86, 65, 61, 78, 1, 38, 76, 62, 97, 29, 83, 69, 93, 68, 3, 63, 38, 4, 12, 23],
      [76, 62, 97, 29, 26, 81, 94, 98, 68, 7, 64, 63, 44, 81, 68, 34, 21, 100, 99, 76]
    ];
    updateQuestionInfo('ds', [
      { difficulty: 'Easy', type: 'Multiple Choice' },
      { difficulty: 'Medium', type: 'Editor' },
      { difficulty: 'Hard', type: 'Editor' }
    ]);
    const dsTagScores = {
      'Data_Preprocessing': {scores: [87, 88, 83, 74, 29, 3, 63, 38, 4, 12, 34, 21, 100, 99, 76, 23, 52, 83, 69, 93] },
      'Feature_Engineering': {scores: [68, 86, 65, 61, 78, 1, 38, 76, 62, 97, 29, 26, 81, 94, 98, 68, 7, 64, 63, 44] },
      'Model_Selection': {scores:[81, 68, 26, 52, 57, 72, 1, 62, 18, 49, 13, 65, 20, 76, 54, 88, 94, 6, 73, 70] },
      'Evaluation_Metrics': {scores: [99, 69, 81, 65, 75, 83, 59, 80, 82, 18, 65, 48, 56, 16, 0, 71, 83, 30, 38, 53] },
      'Visualization': {scores: [15, 41, 49, 9, 27, 30, 9, 40, 31, 44, 33, 39, 65, 94, 99, 63, 58, 59, 43, 96] }
  };

  Object.keys(dsTagScores).forEach(tag => {
      createTagDetailChart(`ds${tag}Chart`, `Data Science ${tag.replace('_', ' ')}`, dsTagScores[tag].scores);
  });
    updateStats('ds', dsScoresTest, dsScoresAll);
    createScoreDistributionChart('dsScoreDistributionChart', 'Data Science', dsScoresTest, dsScoresAll);
    createQuestionScoreCharts('ds', dsQuestionScoresTest, dsQuestionScoresAll);
    showQuestionGraph('ds', 1);
    showFirstTag('ds');
  } else if (tabId === 'sql') {
    // SQL 데이터
    const sqlScoresTest = [
      0,0,0,10,15,30,37,44, 45, 52, 60, 65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 90, 92, 95
    ];
    
    const sqlScoresAll = [
      0, 20, 22, 17, 46,26,32, 36, 40, 45, 50, 55, 58, 60, 62, 65, 68, 70, 72, 75, 77, 80, 82, 85, 
      87, 88, 90, 92, 93, 95, 97, 98, 100, 100, 95
    ];
    const sqlQuestionScoresTest = [
      [55, 65, 75, 85, 95],
      [50, 60, 70, 80, 90],
      [45, 55, 65, 75, 85]
    ];
    const sqlQuestionScoresAll = [
      [50, 60, 70, 80, 90, 100, 87, 88, 83, 74, 29, 3, 63, 38, 4, 12],
      [45, 55, 65, 75, 85, 95, 34, 21, 100, 99, 76, 23, 52, 83, 69, 93],
      [40, 50, 60, 70, 80, 90, 68, 86, 65, 61, 78, 1, 38, 76, 62, 97]
    ];
    updateQuestionInfo('sql', [
      { difficulty: 'Easy', type: 'Multiple Choice' },
      { difficulty: 'Medium', type: 'Multiple Choice' },
      { difficulty: 'Hard', type: 'Editor' }
    ]);
    const sqlTagScores = {
      'Data_Retrieval': { scores: [87, 88, 83, 74, 29, 3, 63, 38, 4, 12, 34, 21, 100, 99, 76, 23, 52, 83, 69, 93] },
      'Data_Filtering': { scores: [68, 86, 65, 61, 78, 1, 38, 76, 62, 97, 29, 26, 81, 94, 98, 68, 7, 64, 63, 44] },
      'Joins': { scores: [81, 68, 26, 52, 57, 72, 1, 62, 18, 49, 13, 65, 20, 76, 54, 88, 94, 6, 73, 70] },
      'Aggregations': { scores: [99, 69, 81, 65, 75, 83, 59, 80, 82, 18, 65, 48, 56, 16, 0, 71, 83, 30, 38, 53] },
      'Subqueries': { scores: [15, 41, 49, 9, 27, 30, 9, 40, 31, 44, 33, 39, 65, 94, 99, 63, 58, 59, 43, 96] }
    };

  Object.keys(sqlTagScores).forEach(tag => {
      createTagDetailChart(`sql${tag}Chart`, `SQL ${tag.replace('_', ' ')}`, sqlTagScores[tag].scores);
  });
    updateStats('sql', sqlScoresTest, sqlScoresAll);
    createScoreDistributionChart('sqlScoreDistributionChart', 'SQL', sqlScoresTest, sqlScoresAll);
    createQuestionScoreCharts('sql', sqlQuestionScoresTest, sqlQuestionScoresAll);
    showQuestionGraph('sql', 1);
    showFirstTag('sql');
  }
}

function createQuestionScoreCharts(tabId, testQuestionScores, allQuestionScores) {
  testQuestionScores.forEach((scores, index) => {
    const canvasId = `${tabId}Question${index + 1}Chart`;
    const canvas = document.getElementById(canvasId);
    canvas.style.display = 'none'; // 초기에 모든 차트를 숨김
    createQuestionScoreChart(canvasId, `${tabId.toUpperCase()} Question ${index + 1}`, scores, allQuestionScores[index]);
  });
}

function createQuestionScoreChart(canvasId, label, testScores, allScores) {
  const calculateFrequencyPercentage = (scores) => {
    const frequency = new Array(5).fill(0);
    scores.forEach(score => {
      const index = Math.min(Math.floor(score / 20), 4);
      frequency[index]++;
    });
    const total = scores.length;
    return frequency.map(count => (count / total) * 100);
  };

  const testFrequencyPercentage = calculateFrequencyPercentage(testScores);
  const allFrequencyPercentage = calculateFrequencyPercentage(allScores);

  const data = {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [
      {
        label: 'Test Candidates',
        data: testFrequencyPercentage,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'All Candidates',
        data: allFrequencyPercentage,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Percentage of Candidates'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          stepSize: 20
        }
      },
      x: {
        title: {
          display: true,
          text: 'Score Range'
        }
      }
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: label
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
          }
        }
      }
    }
  };
  

  createChart(canvasId, 'bar', data, options);
}




function showQuestionGraph(tabId, questionNumber) {
  // 점수 분포 차트의 ID
  const scoreDistributionChartId = `${tabId}ScoreDistributionChart`;

  // 모든 문제별 차트 캔버스를 숨깁니다.
  const questionCharts = document.querySelectorAll(`#${tabId} canvas[id^="${tabId}Question"]`);
  questionCharts.forEach(canvas => canvas.style.display = 'none');

  // 선택된 문제의 차트만 표시합니다.
  const selectedCanvas = document.getElementById(`${tabId}Question${questionNumber}Chart`);
  if (selectedCanvas) {
    selectedCanvas.style.display = 'block';
  }

  // 점수 분포 차트는 항상 표시되도록 합니다.
  const scoreDistributionChart = document.getElementById(scoreDistributionChartId);
  if (scoreDistributionChart) {
    scoreDistributionChart.style.display = 'block';
  }

  // 문제 정보 표시 업데이트
  document.querySelectorAll(`#${tabId} .question-info`).forEach(info => {
    info.style.display = 'none';
  });
  const selectedInfo = document.getElementById(`${tabId}Question${questionNumber}Info`);
  if (selectedInfo) {
    selectedInfo.style.display = 'block';
  }

  // 버튼 활성화 상태 업데이트
  document.querySelectorAll(`#${tabId} .tab-button`).forEach(button => {
    button.classList.remove('active');
  });
  const selectedButton = document.querySelector(`#${tabId} .tab-button:nth-child(${questionNumber})`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // 태그 그래프 상태 유지
  maintainTagGraphState(tabId);
}

function maintainTagGraphState(tabId) {
  const tagCharts = document.querySelectorAll(`#${tabId} canvas[id^="${tabId}Tag"]`);
  tagCharts.forEach(canvas => {
    // 태그 차트의 현재 표시 상태를 유지합니다.
    if (canvas.style.display !== 'none') {
      canvas.style.display = 'block';
    }
  });
}

function updateQuestionInfo(tabId, questionInfos) {
  questionInfos.forEach((info, index) => {
    const infoContainer = document.getElementById(`${tabId}Question${index + 1}Info`);
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Difficulty:</span>
          <span class="stat-value">${info.difficulty}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Type:</span>
          <span class="stat-value">${info.type}</span>
        </div>
      `;
    }
  });
}


function showTagGraph(tabId, tagName) {

  // 모든 태그 차트를 숨깁니다.
  document.querySelectorAll(`#${tabId} .tag-chart`).forEach(chart => {
      chart.style.display = 'none';
  });

  // 선택된 태그의 차트만 표시합니다.
  const selectedChart = document.getElementById(`${tabId}${tagName}Chart`);
  if (selectedChart) {
      selectedChart.style.display = 'block';
  }

  // 모든 태그 정보를 숨깁니다.
  document.querySelectorAll(`#${tabId} .tag-info`).forEach(info => {
      info.style.display = 'none';
  });

  // 선택된 태그의 정보만 표시합니다.
  const selectedInfo = document.getElementById(`${tabId}${tagName}Info`);
  if (selectedInfo) {
      selectedInfo.style.display = 'block';
  }

  // 모든 태그 버튼에서 active 클래스를 제거합니다.
  document.querySelectorAll(`#${tabId} .tag-button`).forEach(button => {
      button.classList.remove('active');
  });

  // 선택된 태그 버튼에 active 클래스를 추가합니다.
  const selectedButton = document.querySelector(`#${tabId} .tag-button[data-tag="${tagName}"]`);
  if (selectedButton) {
      selectedButton.classList.add('active');
  }
}

function createTagDetailChart(canvasId, label, scores) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas with id ${canvasId} not found`);
    return;
  }

  // 빈도수 계산 및 퍼센트로 변환
  const calculateFrequencyPercentage = (scores) => {
    const frequency = new Array(5).fill(0);
    scores.forEach(score => {
      const index = Math.min(Math.floor(score / 20), 4);
      frequency[index]++;
    });
    const total = scores.length;
    return frequency.map(count => (count / total) * 100);
  };

  const frequencyPercentageData = calculateFrequencyPercentage(scores);

  const data = {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [{
      label: 'Score Distribution',
      data: frequencyPercentageData,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage of Candidates'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          stepSize: 20
        }
      },
      x: {
        title: {
          display: true,
          text: 'Score Range'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: label + ' Score Distribution'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
          }
        }
      }
    }
  };

  createChart(canvasId, 'bar', data, options);
}



function showFirstTag(tabId) {
  const firstTagButton = document.querySelector(`#${tabId} .tag-button`);
  if (firstTagButton) {
      const firstTagName = firstTagButton.getAttribute('data-tag');
      showTagGraph(tabId, firstTagName);
  }
}

