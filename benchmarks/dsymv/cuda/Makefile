CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsymv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsymv: dsymv.c $(HDRS) | $(BIN)
	$(CC) dsymv.c -o $(BIN)/dsymv -lcublas

clean:
	rm -rf $(BIN)
