CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsymm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsymm: dsymm.c $(HDRS) | $(BIN)
	$(CC) dsymm.c -o $(BIN)/dsymm -lcublas

clean:
	rm -rf $(BIN)
