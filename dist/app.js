const warmups=[['Palming','A quiet, two-minute reset'],['Acupressure','Gentle touch around the eyes'],['Eye movements','Guided directional tracking'],['Infinity symbol','A smooth figure-eight practice'],['Eye gym','A short movement sequence'],['Near / far focus','Alternate viewing distances']];
const exercises=['Floating spiral','Quiet horizon','Hidden star','Soft geometry','Garden depth','Open sky','Calm current','Balanced circles','Woven focus','Distant form','Layered light','Still center'];
function warmupMarkup(){return warmups.map((w,i)=>`<article class="warmup-item"><span>0${i+1}</span><div><strong>${w[0]}</strong><small>${w[1]}</small></div><button aria-label="Open ${w[0]}">→</button></article>`).join('')}
document.querySelectorAll('#warmup-list,#warmup-app-list').forEach(el=>el.innerHTML=warmupMarkup());
document.querySelector('#library-grid').innerHTML=exercises.map((name,i)=>`<article class="library-card" data-open="session"><div class="pattern pattern-${['a','b','c'][i%3]}"></div><div><strong>${name}</strong><span>${i%2?'Convergence':'Divergence'} · ${i<4?'Basic':i<8?'Intermediate':'Advanced'}</span></div></article>`).join('');

document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const current=button.closest('dialog');if(current?.open)current.close();const modal=document.getElementById(button.dataset.open);if(modal)modal.showModal();if(button.dataset.open==='session')startTimer()}));
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog')?.close()));
document.querySelectorAll('.side-link').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.side-link').forEach(x=>x.classList.remove('active'));button.classList.add('active');document.querySelectorAll('.dashboard-view').forEach(x=>x.classList.toggle('active',x.dataset.panel===button.dataset.view))}));

const test=document.querySelector('#self-test');
document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>setTestStep(2)));
document.querySelectorAll('[data-result]').forEach(button=>button.addEventListener('click',()=>{const type=button.dataset.result;document.querySelector('#test-result').textContent=type==='balanced'?'Begin with a basic guided session and explore both viewing methods at your own pace.':`Begin with basic ${type} exercises—the viewing method you identified as more challenging.`;setTestStep(3)}));
function setTestStep(step){test.querySelectorAll('.test-step').forEach(x=>x.classList.toggle('active',x.dataset.step==step));test.querySelector('.test-progress i').style.width=`${step*33.33}%`}

let remaining=120,interval=null,running=false;
const timerDisplay=document.querySelector('#timer-display'),timerProgress=document.querySelector('#timer-progress'),timerToggle=document.querySelector('#timer-toggle');
function renderTimer(){timerDisplay.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;timerProgress.style.width=`${remaining/120*100}%`}
function startTimer(){clearInterval(interval);remaining=120;running=true;timerToggle.textContent='Ⅱ';renderTimer();interval=setInterval(()=>{if(running&&remaining>0){remaining--;renderTimer()}if(remaining===0){clearInterval(interval);document.querySelector('#session-cue').textContent='Session complete. Blink gently and let your focus return naturally.'}},1000)}
timerToggle.addEventListener('click',()=>{running=!running;timerToggle.textContent=running?'Ⅱ':'▶'});
document.querySelector('#sound-toggle').addEventListener('click',e=>e.currentTarget.classList.toggle('saved'));
document.querySelector('.favorite').addEventListener('click',e=>{e.currentTarget.classList.toggle('saved');e.currentTarget.textContent=e.currentTarget.classList.contains('saved')?'♥':'♡'});
const cues=['Soften your gaze and imagine looking beyond the image.','Keep breathing slowly. Let the image come to you.','Blink whenever you need to—there is no need to strain.'];let cue=0;
document.querySelector('#next-cue').addEventListener('click',()=>{cue=(cue+1)%cues.length;document.querySelector('#session-cue').textContent=cues[cue]});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));button.classList.add('active')}));
