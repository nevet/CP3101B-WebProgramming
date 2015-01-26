window.clickCnt = 0;

function clearLib() {
    $('#cellLib1').text('');
    $('#cellLib').css({
        "font-weight": "normal",
        "color": "black"
    });
}

function clearRiv() {
    $('#cellRiv1').text('');
    $('#cellRiv').css({
        "font-weight": "normal",
        "color": "black"
    });
}

function clearGad() {
    $('#cellGad1').text('');
    $('#cellGad').css({
        "font-weight": "normal",
        "color": "black"
    });
}

function clearHome() {
    $('#cellHome').css({
        "font-weight": "normal",
        "color": "black"
    });
}

function setHomePre() {
    $('#subtitle').text("Prelude");
    $('#cellHome').css({
        "font-weight": "bold",
        "color": "red"
    });
    document.getElementById('content').innerHTML = "They stay in one of the cell in the grid - their <span>home</span>, labeled as H in the grid. There are lots of obstacles in the 2D grid world, labeled as # in the grid. The <i>small cat</i> wants to explore this 2D grid world with his <i>mother cat</i>.";
}

function setHomeFinale() {
    $('#subtitle').text("Finale");
    $('#cellHome').css({
        "font-weight": "bold",
        "color": "red"
    });
    document.getElementById('content').innerHTML = "Finally, they go <span>home</span> H again to close their fun day.";
}

function setRiv() {
    $('#subtitle').text("Part 1");
    $('#cellRiv').css({
        "font-weight": "bold",
        "color": "red"
    });
    document.getElementById('content').innerHTML = "First, they visit the <span>river</span>, labeled as R in the grid and the <i>small cat</i> will play hide-and-seek there.";
    $('#cellRiv1').text('Cc');
}

function setLib() {
    $('#subtitle').text("Part 3");
    $('#cellLib').css({
        "font-weight": "bold",
        "color": "red"
    });
    document.getElementById('content').innerHTML = "Next, they visit the <span>library</span>, labeled as L in the grid because this cat family like to read.";
    $('#cellLib1').text('Cc');
}

function setGad() {
    $('#subtitle').text("Part 2");
    $('#cellGad').css({
        "font-weight": "bold",
        "color": "red"
    });
    document.getElementById('content').innerHTML = "Next, they visit the <span>garden</span>, labeled as G in the grid and the <i>small cat</i> will learn about the many flowers that grow there.";
    $('#cellGad1').text('Cc');
}

$(document).ready(function() {
    $('#navRight').click(function () {
        clickCnt = (clickCnt + 1) % 5;
        switch (clickCnt) {
            case 0:
                setHomePre();
                break;
            case 1:
                clearHome();
                setRiv();
                break;
            case 2:
                clearRiv();
                setGad();
                break;
            case 3:
                clearGad();
                setLib();
                break;
            case 4:
                clearLib();
                setHomeFinale();
                break;
        }
    });

    $('#navLeft').click(function () {
        clickCnt = (clickCnt + 4) % 5;
        switch (clickCnt) {
            case 0:
                clearRiv();
                setHomePre();
                break;
            case 1:
                clearGad();
                setRiv();
                break;
            case 2:
                clearLib();
                setGad();
                break;
            case 3:
                clearHome();
                setLib();
                break;
            case 4:
                setHomeFinale();
                break;
        }
    });
});