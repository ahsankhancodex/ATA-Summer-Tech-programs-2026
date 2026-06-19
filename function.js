// ── GOOGLE SHEETS ENDPOINT ──
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzCtumt7c2sqg2SP11CvntbBWruhpUJl-DTyX-BHxHmFPoQifE6sZvi914HR4ExWL339A/exec';

// ── COUNTDOWN TIMER ──
(function tick() {
  const deadline = new Date('2026-06-30T23:59:59');
  const now = new Date();
  const diff = deadline - now;

  if (diff <= 0) {
    document.getElementById('cd').textContent = 'Closed';
    return;
  }

  const days    = Math.floor(diff / 864e5);
  const hours   = Math.floor(diff % 864e5 / 36e5);
  const minutes = Math.floor(diff % 36e5 / 6e4);
  const seconds = Math.floor(diff % 6e4 / 1e3);

  document.getElementById('cd').textContent =
    days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';

  setTimeout(tick, 1000);
})();

// ── COURSE CHECKBOX TOGGLE ──
function toggleCB(el, e) {
  e.preventDefault();
  el.classList.toggle('on');
}

// ── TOGGLE ALL COURSES ──
function toggleAllCourses(el, e) {
  e.preventDefault();
  const turnOn = !el.classList.contains('on');
  document.querySelectorAll('#courseGrid .cb-item').forEach(function (item) {
    if (turnOn) {
      item.classList.add('on');
    } else {
      item.classList.remove('on');
    }
  });
}

// ── FIELD VALIDATION ──
function validateField(id) {
  const el = document.getElementById(id);
  if (!el.value.trim()) {
    el.style.borderColor = 'var(--red)';
    return false;
  }
  el.style.borderColor = '';
  return true;
}

// ── FORM SUBMIT HANDLER ──
function handleSubmit(e) {
  e.preventDefault();

  // Required field IDs
  const requiredFields = [
    'studentName', 'dob', 'age', 'gender', 'grade', 'school',
    'parentName', 'relation', 'whatsapp', 'email',
    'address', 'device', 'internet', 'package', 'payMethod', 'source'
  ];

  // Validate all required fields
  let allValid = true;
  let firstInvalid = null;

  requiredFields.forEach(function (id) {
    if (!validateField(id)) {
      if (allValid) firstInvalid = id;
      allValid = false;
    }
  });

  if (!allValid) {
    document.getElementById(firstInvalid).scrollIntoView({ behavior: 'smooth', block: 'center' });
    alert('Please fill in all required fields (marked with *).');
    return;
  }

  // Validate course selection
  const selectedCourses = [...document.querySelectorAll('#courseGrid .cb-item.on')]
    .map(function (item) { return item.querySelector('input').value; });

  if (!selectedCourses.length) {
    alert('Please select at least one course.');
    document.getElementById('courseGrid').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // Validate terms agreement
  if (!document.getElementById('termsRow').classList.contains('on')) {
    alert('Please agree to the Terms & Conditions.');
    return;
  }

  // Disable button & show spinner
  const btn = document.getElementById('subBtn');
  btn.disabled = true;
  document.getElementById('spin').style.display = 'block';
  document.getElementById('subTxt').textContent = 'Submitting...';

  // Build payload
  const data = {
    timestamp:    new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    studentName:  document.getElementById('studentName').value.trim(),
    dob:          document.getElementById('dob').value,
    age:          document.getElementById('age').value,
    gender:       document.getElementById('gender').value,
    grade:        document.getElementById('grade').value,
    school:       document.getElementById('school').value.trim(),
    experience:   document.getElementById('experience').value,
    parentName:   document.getElementById('parentName').value.trim(),
    relation:     document.getElementById('relation').value,
    whatsapp:     document.getElementById('whatsapp').value.trim(),
    email:        document.getElementById('email').value.trim(),
    phone2:       document.getElementById('phone2').value.trim(),
    address:      document.getElementById('address').value.trim(),
    courses:      selectedCourses.join(', '),
    device:       document.getElementById('device').value,
    internet:     document.getElementById('internet').value,
    package:      document.getElementById('package').value,
    payMethod:    document.getElementById('payMethod').value,
    txnRef:       document.getElementById('txnRef').value.trim(),
    source:       document.getElementById('source').value,
    referral:     document.getElementById('referral').value.trim(),
    goals:        document.getElementById('goals').value.trim(),
    questions:    document.getElementById('questions').value.trim(),
  };

  // ── FIX: Use 'text/plain' instead of 'application/json'
  // 'application/json' triggers a CORS preflight that Apps Script rejects.
  // 'text/plain' sends a simple request — Apps Script receives the JSON body
  // in e.postData.contents and we parse it there with JSON.parse().
  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data)
  })
  .then(function() { showSuccess(data); })
  .catch(function() { showSuccess(data); });
}

// ── SHOW SUCCESS SCREEN ──
function showSuccess(data) {
  document.getElementById('regForm').style.display = 'none';
  document.getElementById('sName').textContent = data.studentName;
  document.getElementById('sWA').textContent   = data.whatsapp;

  const successDiv = document.getElementById('successDiv');
  successDiv.classList.add('show');
  successDiv.scrollIntoView({ behavior: 'smooth' });
}
