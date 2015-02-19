var noteApp = {
    init: function() {
        if (this.hasStorage) {
            this.elements().events();
            storedNotes = [];
            storedNotes = JSON.parse(localStorage["notes"]);
            this.showNotes(storedNotes); 
        }
    },
    elements: function() {
        this.input  = $('#input');
        this.submit = $('#submit');
        this.list   = $('#list');
        this.del = $('.del');
        return this; 
    },
    events: function() {
        var self = this;

        this.submit.on('click', function(){
            self.addNote();
        });

        this.list.on('click', '.del', function() {
            self.delNote($(this).parent());
        }).on('mouseenter', '.del', function() {
            $(this).parent().addClass('to-del');
        }).on('mouseleave', '.del', function() {
            $(this).parent().removeClass('to-del')
        });
    },
    hasStorage: (function() {
        return typeof(Storage) !== "undefined"; 
    })(),
    addNote: function() {
        var self = this;
        if (this.input.val() === "" || this.input.val() === " " ) {
          this.input.addClass('shake');
          setTimeout(function () {
              self.input.removeClass('shake');
          }, 500);
          return false;
        } else {
          this.saveNote(this.input.val());
          this.list.append('<li>' + this.input.val() + '<span class="del">×</span></li>');
          this.clearField(); 
        }
    },
    clearField: function() {
      var self = this;
      this.input.addClass('added');
      setTimeout(function () {
        self.input.removeClass('added');
        self.input.val('');
      }, 400);
    },
    delNote : function(note) {
        note.children('span').remove();
        var noteText = note.text();
        for (var i = storedNotes.length; i > -1; i--) {
            if (storedNotes[i] == noteText) {
              storedNotes.splice(i, 1);
              localStorage["notes"] = JSON.stringify(storedNotes);
            }
        }
        note.addClass('removing').fadeOut(100, function(){
        $(this).css({
            "visibility":"hidden", 
            'display':'block'
          }).slideUp(100, function(){
            $(this).remove();
            noteApp.checkEmpty();
          });
        });
    },
    saveNote : function(note) { 
        if (storedNotes.length > 0) {
          storedNotes[storedNotes.length] = note;
        } else {
          storedNotes[0] = note; 
        }
        localStorage["notes"] = JSON.stringify(storedNotes); 
        this.checkEmpty();
    },
    showNotes : function() {
        this.list.empty();
        for (var i = 0; i < storedNotes.length; i++) {  
          this.list.append('<li>' + storedNotes[i] + '<span class="del">×</span></li>');
        }
        this.checkEmpty();
    },
    checkEmpty : function() {
      if (!this.list.children('li').length) {
          this.list.addClass('empty');
        } else {
          this.list.removeClass('empty');
        }
    }
}

$(function() { 
  noteApp.init();  
});