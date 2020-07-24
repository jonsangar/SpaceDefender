var juego = new Phaser.Game(400,540,Phaser.CANVAS,'div_juego');

var personaje;
var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var enemigos;
var timer;
var puntos;
var textPuntos;
var vidas;
var textVidas;

var Juego = {
    preload: function(){
        juego.load.image('nave','img/nave.png');
        juego.load.image('laser','img/laser.png');
        juego.load.image('fondo','img/bg.png');
        juego.load.image('enemigo','img/malo.png');
    },
    create: function(){
        juego.add.tileSprite(0,0,400,540,'fondo');
        personaje = juego.add.sprite(juego.width/2,500,'nave');
        personaje.anchor.setTo(0.5);
        //personaje.angle = -90;
        puntos = 0;
        vidas = 3;
        
        juego.add.text(20,20,"Puntos",{font: "14px Arial",fill:"#FFF"});
        juego.add.text(320,20,"Vidas",{font: "14px Arial",fill:"#FFF"});
        
        txtPuntos = juego.add.text(80,20,"0",{font: "14px Arial",fill:"#FFF"});
        
        textVidas = juego.add.text(360,20,"3",{font: "14px Arial",fill:"#FFF"});
        
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        juego.physics.arcade.enable(personaje);
        
        balas = juego.add.group();
        balas.enableBody = true;
        balas.setBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(30,'laser');
        balas.setAll('anchor.x',0.5);
        balas.setAll('anchor.y',0.5);
        balas.setAll('checkWorldBounds',true);
        balas.setAll('outOfBoundsKill',true);
        
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.setBodyType = Phaser.Physics.ARCADE;
        enemigos.createMultiple(20,'enemigo');
        enemigos.setAll('anchor.x',0.5);
        enemigos.setAll('anchor.y',0.5);
        enemigos.setAll('checkWorldBounds',true);
        enemigos.setAll('outOfBoundsKill',true);
        
        timer = juego.time.events.loop(2000,this.crearEnemigo,this);
        
        
        
    },
    update: function(){
        personaje.rotation = juego.physics.arcade.angleToPointer(personaje);
        
        if(juego.input.activePointer.isDown){
            this.disparar();
        }
        
        juego.physics.arcade.overlap(balas,enemigos,this.colision,null,this);
        
        enemigos.forEachAlive(function(m){
            if(m.position.y > 520){
                vidas--;
                m.kill();
                textVidas.text = vidas;
            }
        });
        
        if(vidas == '-1')
            juego.state.start('Terminado');
    },
    
    disparar: function(){
         
        
        if(juego.time.now > tiempo && balas.countDead() > 0){
            tiempo = juego.time.now + tiempoEntreBalas;
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(personaje.x,personaje.y);
            bala.rotation = juego.physics.arcade.angleToPointer(bala);
            juego.physics.arcade.moveToPointer(bala,200);
        }
        
        
    },
    
    crearEnemigo: function(){
        var enem = enemigos.getFirstDead();
        var num = Math.floor(Math.random()*10) + 1;
        enem.reset(num*39,0);
        enem.anchor.setTo(0.5);
        enem.body.velocity.y = 100;
        if(puntos > 10){
            enem.body.velocity.y = 150;
        } else if(puntos > 25){
            enem.body.velocity.y = 200;
        }
        enem.checkWorldBounds = true;
        enem.outOfBoundsKill = true;
    },
    
    colision: function(b,e){
        b.kill();
        e.kill();
        puntos++;
        txtPuntos.text = puntos;
    }
};

var Terminado = {
    preload: function(){
        
    },
    create: function(){
        juego.stage.backgroundColor = "#990000";
    },
    update: function(){
        
    }
};


juego.state.add('Juego',Juego);
juego.state.add('Terminado',Terminado);

juego.state.start('Juego');