#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import os
import imghdr
import uuid
from flask import Flask, request, session, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from models import User, JobSite, Material, Image, Prints, PunchList
from config import app, db, bcrypt 
from datetime import datetime

# Local imports

# Add your model imports


# Views go here!

# def validate_image(stream):
#     header = stream.read(512) #reading the first 512 bytes of the image file to tell what type of image type.
#     stream.seek(0)
#     format = imghdr.what(None, header)
#     if not format:
#         return None
#     return "." + (format if format != "jpeg" else "jpg")

@app.route('/')
def index():
    return '<h1>Work Buddy</h1>'


# START USERS/CHECK

@app.post('/api/users')
def create_user():
    data = request.json
    try:
        new_user = User(username=data['username'])
        new_user.password = data['password']  # Ensure password hashing here
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id 
        return new_user.to_dict(), 201
    except Exception as e:
        db.session.rollback()  # Rollback transaction on error
        return { 'error': str(e) }, 406

@app.get('/api/check_session')
def check_session():
    user_id = session.get('user_id')

    if user_id:
        user = User.query.where(User.id == user_id).first()
        return user.to_dict(), 200
    else:
        return {}, 204


@app.post('/api/login')
def login():
    data = request.json 
    user = User.query.where(User.username == data['username']).first()
    if user and user.authenticate(data['password']):
        session['user_id'] = user.id 
        return user.to_dict(), 201
    else:
        return { 'error': 'Invalid username or password' }, 401

@app.delete('/api/logout')
def logout():
    session.pop('user_id')
    return {}, 204

#END USERS/CHECK

# START OF JOBSITE

# READ
@app.get('/api/jobsites')
def all_jobsites():
    jobsite_list = JobSite.query.all()
    jobsite_dict = [ jobsite.to_dict() for jobsite in jobsite_list ]

    return jobsite_dict, 200

# READ BY ID
@app.get('/api/jobsites/<int:id>')
def get_jobsite(id):
    found_jobsite = JobSite.query.where(JobSite.id == id).first()

    if found_jobsite:
        return found_jobsite.to_dict(), 200
    else:
        return jsonify({ "message": "Jobsite not found" }), 404
    

# POST
@app.post('/api/jobsites')
def create_jobsite():
    data = request.json

    # Parse datetime fields
    existing_jobsite = JobSite.query.filter_by(
        name=data['name'],
        location=data['location'],
        startdate=data['startdate'],
        enddate=data['enddate'],
        note=data['note']
       
    ).first()

    if existing_jobsite:
        return jsonify({"message": "Jobsite already exists"}), 400

    new_jobsite = JobSite(
        name=data['name'],
        location=data['location'],
        startdate=data['startdate'],
        enddate=data['enddate'],
        note=data.get('note')
       
    )

    try:
        db.session.add(new_jobsite)
        db.session.commit()

        return new_jobsite.to_dict(), 201

    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 400

# PATCH 
@app.patch('/api/jobsites/<int:id>')
def update_jobsite(id):
    found_jobsite = JobSite.query.where(JobSite.id == id).first()

    if found_jobsite:
        data = request.json

        try:
            for key in data:
                setattr(found_jobsite, key, data[key])

            db.session.add(found_jobsite)
            db.session.commit()

            return found_jobsite.to_dict(), 202

        except Exception as e:
            return {"error": str(e)}, 400

    else:
        return {"error": "Could not find JobSite"}, 404


# DELETE
@app.delete('/api/jobsites/<int:id>')
def delete_jobsite_by_id(id):

    found_jobsite = JobSite.query.filter_by(id=id).first()

    if found_jobsite:
        db.session.delete(found_jobsite)
        db.session.commit()
        return {}, 204
    else:
        return { 'error': "Not Found" }, 404
# END OF JOBSITE


# START OF MATERIAL
# READ
# @app.get('/api/materials')
# def all_materials():
  
#     material_list = Material.query.all()
#     material_dict = [ materials.to_dict() for materials in material_list ]

#     return material_dict, 200
@app.get('/api/jobsites/<int:jobsite_id>/materials')
def get_materials_by_jobsite(jobsite_id):
    materials = Material.query.filter_by(jobsite_id=jobsite_id).all()
    material_dict = [material.to_dict() for material in materials]
    return material_dict, 200


# READ BY ID
@app.get('/api/materials/<int:id>')
def get_material(id):

    found_material = Material.query.where(Material.id == id).first()
    if found_material:
        return found_material.to_dict(), 200
    else:
        return { "error": "Not Found" }, 404
    
# POST
# @app.post('/api/materials')
# def create_material():
#     data = request.get_json()
#     try:
#         # Validate and process the incoming data
#         datelist = data['datelist']
#         content = data['content']
#         # Create and save the new material
#         new_material = Material(datelist=datelist, content=content)
#         db.session.add(new_material)
#         db.session.commit()
#         return jsonify(new_material.to_dict()), 201
#     except KeyError as e:
#         return jsonify({'error': f'Missing key: {e}'}), 400
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400
@app.post('/api/jobsites/<int:jobsite_id>/materials')
def create_material(jobsite_id):
    data = request.get_json()
    try:
        datelist = data['datelist']
        content = data['content']
        new_material = Material(datelist=datelist, content=content, jobsite_id=jobsite_id)
        db.session.add(new_material)
        db.session.commit()
        return jsonify(new_material.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing key: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

   

    
# PATCH
# @app.patch('/api/materials/<int:id>')
# def update_material(id):

#     found_material = Material.query.where(Material.id == id).first()

#     if found_material:
#         data = request.json

#         try:
#             for key in data:
#                 setattr(found_material, key, data[key])

#                 db.session.add(found_material)
#                 db.session.commit()

#             return found_material.to_dict(), 202
        
#         except Exception as e:
#             return { "error": str(e)}, 400
        
#     else:
#         return {"error": "Could not find Material"}, 404
@app.patch('/api/jobsites/<int:jobsite_id>/materials/<int:id>')
def update_material(jobsite_id, id):
    found_material = Material.query.filter_by(id=id, jobsite_id=jobsite_id).first()
    if found_material:
        data = request.get_json()
        try:
            for key in data:
                setattr(found_material, key, data[key])
            db.session.commit()
            return found_material.to_dict(), 202
        except Exception as e:
            return {'error': str(e)}, 400
    else:
        return {'error': 'Material not found for this job site'}, 404

    
# DELETE
# @app.delete('/api/materials/<int:id>')
# def delete_material(id):

#     found_material = Material.query.where(Material.id == id).first()

#     if found_material:

#         db.session.delete(found_material)
#         db.session.commit()

#         return {}, 204
    
#     else:
#         return { "error": "Not Found"}, 404
@app.delete('/api/jobsites/<int:jobsite_id>/materials/<int:id>')
def delete_material(jobsite_id, id):
    found_material = Material.query.filter_by(id=id, jobsite_id=jobsite_id).first()
    if found_material:
        db.session.delete(found_material)
        db.session.commit()
        return {}, 204
    else:
        return {'error': 'Material not found for this job site'}, 404


# END OF MATERIAL


# START OF PRINTS
# READ
@app.get('/api/prints')
def all_prints():
    print_list = Prints.query.all()
    print_dict = [ prints.to_dict() for prints in print_list ]

    return print_dict, 200

# READ BY ID
@app.get('/api/print/<int:id>')
def get_print(id):

    found_print = Prints.query.where(Prints.id == id).first()

    if found_print:
        return found_print.to_dict(), 200
    
    else:
        return { "error": "Not found"}, 404

# POST
@app.post('/api/prints')
def create_print():

    data = request.json
# (jobsite_id=data['jobsite_id'])
    try:
        new_print = Prints(url=data['url'])
        db.session.add(new_print)
        db.session.commit()

        return new_print.to_dict(), 201
    
    except Exception as e:
        return { 'error': str(e)}, 400


# DELETE
@app.delete('/api/prints/<int:id>')
def delete_print(id):

    found_print = Prints.query.where(Prints.id == id).first()

    if found_print:
        db.session.delete(found_print)
        db.session.commit()

        return {}, 204
    
    else:
        return {"error": "Did not find Print"}, 404
# END OF PRINTS

# START OF PUNCHLIST
# READ
@app.get('/api/punchlists')
def all_punchlists():
      punchlist_list = PunchList.query.all()
      punchlist_dict = [ punchlist.to_dict() for punchlist in punchlist_list ]

      return punchlist_dict, 200

# READ BY ID
@app.get('/api/punchlists/<int:id>')
def get_punchlist(id):
    found_punchlist = PunchList.query.where(PunchList.id == id).first()

    if found_punchlist:
        return found_punchlist.to_dict(), 200
    else:
        return {"error": "Not found"}, 404
    
# POST
@app.post('/api/punchlists')
def create_punchlist():
    data = request.json

    try:
        new_punchlist = PunchList(name=data['name'])
        db.session.add(new_punchlist)
        db.session.commit()

        return new_punchlist.to_dict(), 201
    
    except Exception as e:
        return { "error": str(e)}, 400
    
    
# PATCH
@app.patch('/api/punchlists/<int:id>')
def update_punchlist(id):
    found_punchlist = PunchList.query.where(PunchList.id == id).first()

    if found_punchlist:
        data = request.json

    try:
        for key in data:
            setattr( found_punchlist, key, data[key])
            db.session.add(found_punchlist)
            db.session.commit()

            return found_punchlist.to_dict(), 202
        
    except Exception as e:
        return { 'error': str(e)}, 400
    
    else:
        return { 'error': 'Could not find Punchlist'}, 404
    
    
# DELETE
@app.delete('/api/punchlists/<int:id>')
def delete_punchlist(id):
    found_punchlist = PunchList.query.where(PunchList.id == id).first()

    if found_punchlist:
        db.session.delete(found_punchlist)
        db.session.commit()

        return {}, 204
    
    else:
        return {'error': 'Not Found'}, 404

# END OF PUNCHLIST

# START OF IMAGES
# READ
@app.get('/api/jobsites/<int:id>/images')
def get_jobsite_images(id):
    images = Image.query.filter_by(jobsite_id=id).all()
    image_dicts = [image.to_dict() for image in images]
    return image_dicts, 200
    
# READ BY ID
@app.get('/api/images/<int:id>')
def get_image(id):
    found_image = Image.query.where(Image.id == id).first()

    if found_image:
        return found_image.to_dict(), 200
    else:
        return { 'error': "Not Found"}, 404
    
# POST
@app.post('/api/images')
def create_image():
    data = request.json

    try:
        new_image = Image(location=data['location'], note=data['note'])
        db.session.add(new_image)
        db.session.commit()

        return new_image.to_dict(), 201
    
    except Exception as e:
        return { 'error': str(e)}, 400
    
# PATCH
@app.patch('/api/images/<int:id>')
def update_image(id):
    found_image = Image.query.where(Image.id == id).first()

    if found_image:
        data = request.json

    try:
        for key in data:
            setattr(found_image, key, data[key])
            db.session.add(found_image)
            db.session.commit()

            return found_image.to_dict(), 202
        
    except Exception as e:
        return { 'error': str(e)}, 400
    
# DELETE
@app.delete('/api/images/<int:id>')
def delete_image(id):
    found_image = Image.query.where(Image.id == id).first()
    if found_image:
        db.session.delete(found_image)
        db.session.commit()

        return {}, 204
    
    else:
        return {'error': 'Not Found'}, 404
# END OF IMAGES

# @app.post('/upload')
# def upload():
#     pass
   


if __name__ == '__main__':
    app.run(port=5555, debug=True)

