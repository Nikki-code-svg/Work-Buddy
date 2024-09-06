from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db, bcrypt
from datetime import datetime

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users_table'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    jobsites = db.relationship('JobSite', back_populates='user')

    serialize_rules = ("-password_hash", "-jobsites.user",)

    @property
    def password(self):
        raise Exception("Safety First")

    @password.setter
    def password(self, value):
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self.password_hash, password_to_check)


class JobSite(db.Model, SerializerMixin):
    __tablename__ = 'jobsite_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    startdate = db.Column(db.String, nullable=False)
    enddate = db.Column(db.String)
    note = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users_table.id'))

    user = db.relationship('User', back_populates='jobsites')
    materials = db.relationship('Material', back_populates='jobsite')
    images = db.relationship('Image', back_populates='jobsite')
    prints = db.relationship('Prints', back_populates='jobsite')
    punchlists = db.relationship('PunchList', back_populates='jobsite')

    serialize_rules = ('-user.jobsite', '-materials.jobsite', '-images.jobsite', '-prints.jobsite', '-punchlists.jobsite',)


class Material(db.Model, SerializerMixin):
    __tablename__ = 'material_table'

    id = db.Column(db.Integer, primary_key=True)
    datelist = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)

    jobsite_id = db.Column(db.Integer, db.ForeignKey('jobsite_table.id'))
    jobsite = db.relationship('JobSite', back_populates='materials')

    serialize_rules = ('-jobsite.materials',)


class Image(db.Model, SerializerMixin):
    __tablename__ = 'images_table'

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    note = db.Column(db.String)
    url = db.Column(db.String, nullable=False)

    jobsite_id = db.Column(db.Integer, db.ForeignKey('jobsite_table.id'))
    jobsite = db.relationship('JobSite', back_populates='images')

    serialize_rules = ('-jobsite.images',)


class Prints(db.Model, SerializerMixin):
    __tablename__ = 'prints_table'

    id = db.Column(db.Integer, primary_key=True)
   
    url = db.Column(db.String, nullable=False)

    jobsite_id = db.Column(db.Integer, db.ForeignKey('jobsite_table.id'))
    jobsite = db.relationship('JobSite', back_populates='prints')

    serialize_rules = ('-jobsite.prints',)


class PunchList(db.Model, SerializerMixin):
    __tablename__ = 'punchlist_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    jobsite_id = db.Column(db.Integer, db.ForeignKey('jobsite_table.id'))
    jobsite = db.relationship('JobSite', back_populates='punchlists')

    serialize_rules = ('-jobsite.punchlists',)


