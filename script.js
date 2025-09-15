const iframe = document.getElementById('cityFrame');
const client = new Sketchfab(iframe);
const extra = document.getElementById('extra');
const extraLogo = document.getElementById('extraLogo');
const extraText = document.getElementById('extraText');

let api = null;
let currentTargetPos = null;
let isAutoMoving = false;
let trackDelayOver = false;
let userMoved = false;
let lastCameraPos = null;
const distanceThreshold = 1.0;

const homePosition = [7.165681330597569,-1.2666987885394803,4.3479758932260575];
const homeTarget   = [26.06318534533811,-9.071991453694814,8.553788468058091];

client.init('885d8034bc02407fb48cf7f0dfe61d67', {
    success: function(_api) {
        api = _api;
        api.start();
        api.addEventListener('viewerready', function() {
            console.log('Viewer готов!');
            setupButtons();

            setInterval(() => {
                if(!api || !currentTargetPos || !trackDelayOver) return;
                api.getCameraLookAt((err, cam) => {
                    if(err) return;

                    if(!isAutoMoving){
                        if(lastCameraPos){
                            const dx = cam.position[0] - lastCameraPos[0];
                            const dy = cam.position[1] - lastCameraPos[1];
                            const dz = cam.position[2] - lastCameraPos[2];
                            if(Math.sqrt(dx*dx + dy*dy + dz*dz) > 0.001) userMoved = true;
                        }
                        lastCameraPos = cam.position;

                        if(userMoved){
                            const dx = cam.position[0] - currentTargetPos[0];
                            const dy = cam.position[1] - currentTargetPos[1];
                            const dz = cam.position[2] - currentTargetPos[2];
                            if(Math.sqrt(dx*dx + dy*dy + dz*dz) > distanceThreshold){
                                extra.style.display = 'none';
                                userMoved = false;
                            }
                        }
                    }
                });
            }, 200);
        });
    },
    error: function() { console.error('Ошибка инициализации Sketchfab'); }
});

function moveCamera(logo, text, target, position){
    if(!api) return;
    currentTargetPos = position;
    userMoved = false;
    lastCameraPos = null;
    trackDelayOver = false;
    extra.style.display = 'none';
    isAutoMoving = true;

    api.setCameraLookAt(target, position, 2, () => {
        isAutoMoving = false;
        if(logo){
            extraLogo.src = logo;
            extraText.textContent = text || '';
            extra.style.display = 'block';
            extra.style.opacity = '1';
        }
        setTimeout(()=> trackDelayOver = true, 7000);
    });
}

function moveCameraHome(target, position){
    if(!api) return;
    currentTargetPos = null;
    userMoved = false;
    trackDelayOver = false;
    extra.style.display = 'none';
    isAutoMoving = true;

    api.setCameraLookAt(target, position, 2, () => { isAutoMoving = false; });
}

function setupButtons(){
    document.getElementById('homeButton').addEventListener('click', () => moveCameraHome(homeTarget, homePosition));
    document.getElementById('xButton').addEventListener('click', () =>
        moveCamera('Logo.png', 'System-X: глобальный менеджмент и кооперации.', [-1.248,7.884,1.430],[1.733,-2.279,2.809])
    );
    document.getElementById('alphaButton').addEventListener('click', () =>
        moveCamera('logoAlpha.png', 'Инвестиционный фонд для высокой прибыли.', [-3.928,0.516,2.363],[4.538,0.669,1.428])
    );
    document.getElementById('ascendiaButton').addEventListener('click', () =>
        moveCamera('ascendialogo.png', 'Ascendia: работа с клиентами до первой сделки.', [-3.930,-0.474,2.179],[1.149,-0.383,1.618])
    );
    document.getElementById('rentcarButton').addEventListener('click', () =>
        moveCamera('RentCarLogo.png', 'Пока нет информации о бренде', [-9.729,3.941,0.066],[-9.723,4.243,0.088])
    );
}
